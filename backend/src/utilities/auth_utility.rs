use actix_web::{
    dev::Payload,
    error::{ErrorForbidden, ErrorInternalServerError, ErrorUnauthorized},
    web, Error, FromRequest, HttpRequest,
};
use jsonwebtoken::{Algorithm, DecodingKey, crypto};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{future::Future, pin::Pin};
use base64::{Engine, engine::general_purpose::URL_SAFE_NO_PAD};

#[derive(Clone)]
pub struct ClerkConfig {
    pub jwks_url: String,
    pub allowed_azp: Vec<String>,
    pub http: Client,
}

#[derive(Debug, Deserialize)]
struct Jwks {
    keys: Vec<Jwk>,
}

#[derive(Debug, Deserialize)]
struct Jwk {
    kid: String,
    n: String,
    e: String,
    kty: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClerkClaims {
    pub sub: String,
    pub sid: Option<String>,
    pub exp: usize,
    pub nbf: Option<usize>,
    pub azp: Option<String>,
    pub sts: Option<String>,
}

pub struct AuthenticatedUser(pub ClerkClaims);

impl FromRequest for AuthenticatedUser {
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let cfg = req
            .app_data::<web::Data<ClerkConfig>>()
            .cloned();

        let auth_header = req
            .headers()
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .map(|s| s.to_string());

        let session_cookie = req.cookie("__session").map(|c| c.value().to_string());

        Box::pin(async move {
            let cfg = cfg.ok_or_else(|| ErrorInternalServerError("Missing ClerkConfig"))?;

            let token = if let Some(ref auth) = auth_header {
                auth.strip_prefix("Bearer ")
                    .map(str::to_string)
                    .ok_or_else(|| ErrorUnauthorized("Invalid Authorization header"))?
            } else if let Some(cookie_token) = session_cookie {
                cookie_token
            } else {
                return Err(ErrorUnauthorized("Missing Clerk session token"));
            };

            // Split JWT into 3 parts
            let parts: Vec<&str> = token.splitn(3, '.').collect();
            if parts.len() != 3 {
                return Err(ErrorUnauthorized("Invalid JWT format"));
            }

            // 1. Manually decode the HEADER (can't use decode_header — it chokes on Clerk's "oiat" integer field)
            let header_bytes = URL_SAFE_NO_PAD.decode(parts[0])
                .map_err(|_| ErrorUnauthorized("Invalid JWT header encoding"))?;
            let header_json: serde_json::Value = serde_json::from_slice(&header_bytes)
                .map_err(|_| ErrorUnauthorized("Invalid JWT header JSON"))?;

            // Verify algorithm is RS256
            let alg = header_json["alg"].as_str()
                .ok_or_else(|| ErrorUnauthorized("Missing alg in JWT header"))?;
            if alg != "RS256" {
                return Err(ErrorUnauthorized("Unexpected JWT algorithm"));
            }

            // Extract kid for JWKS lookup
            let kid = header_json["kid"].as_str()
                .ok_or_else(|| ErrorUnauthorized("Missing kid in JWT header"))?
                .to_string();

            // 2. Fetch JWKS from Clerk and find matching key
            let jwks: Jwks = cfg
                .http
                .get(&cfg.jwks_url)
                .send()
                .await
                .map_err(|_| ErrorInternalServerError("Failed to fetch JWKS"))?
                .json()
                .await
                .map_err(|_| ErrorInternalServerError("Invalid JWKS response"))?;

            let jwk = jwks
                .keys
                .into_iter()
                .find(|k| k.kid == kid && k.kty == "RSA")
                .ok_or_else(|| ErrorUnauthorized("No matching JWK found"))?;

            let decoding_key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)
                .map_err(|_| ErrorUnauthorized("Invalid RSA key"))?;

            // 3. Verify the RSA signature
            let message = format!("{}.{}", parts[0], parts[1]);
            let valid = crypto::verify(parts[2], message.as_bytes(), &decoding_key, Algorithm::RS256)
                .map_err(|e| {
                    println!("[AUTH] Signature verification error: {:?}", e);
                    ErrorUnauthorized("Signature verification failed")
                })?;
            if !valid {
                return Err(ErrorUnauthorized("Invalid JWT signature"));
            }

            // 4. Manually decode the PAYLOAD
            let payload_bytes = URL_SAFE_NO_PAD.decode(parts[1])
                .map_err(|_| ErrorUnauthorized("Invalid JWT payload encoding"))?;
            let claims: ClerkClaims = serde_json::from_slice(&payload_bytes)
                .map_err(|e| {
                    println!("[AUTH] Claims parsing error: {:?}", e);
                    ErrorUnauthorized("Invalid JWT claims")
                })?;

            // 5. Check expiration
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map_err(|_| ErrorInternalServerError("System time error"))?
                .as_secs() as usize;
            if claims.exp < now {
                return Err(ErrorUnauthorized("Token expired"));
            }

            // 6. Validate authorized party (azp)
            if let Some(azp) = &claims.azp {
                let allowed = cfg.allowed_azp.iter().any(|origin| origin == azp);
                if !allowed {
                    return Err(ErrorUnauthorized("Invalid azp"));
                }
            }

            // 7. Check organization membership status
            if claims.sts.as_deref() == Some("pending") {
                return Err(ErrorForbidden("Organization membership pending"));
            }

            println!("[AUTH] Clerk auth successful for user: {}", claims.sub);
            Ok(AuthenticatedUser(claims))
        })
    }
}