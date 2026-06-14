// Shared test helpers — imported by each bin test file
// Contains JWT generation and common config

use jsonwebtoken::{encode, EncodingKey, Header, Algorithm};
use serde::{Deserialize, Serialize};

// Must match the AuthVal struct in backend/src/utilities/auth_utility.rs
#[derive(Debug, Serialize, Deserialize)]
pub struct AuthClaims {
    pub email: String,
    pub password: String,
    // Standard JWT claims — jsonwebtoken requires at least exp
    pub exp: usize,
}

/// Generates a signed JWT using the same secret the backend reads.
/// Set TEST_JWT_SECRET in your .env (must match JWT_SECRET in backend .env).
pub fn generate_test_jwt(email: &str, password: &str, secret: &str) -> String {
    let expiry = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(1))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = AuthClaims {
        email: email.to_string(),
        password: password.to_string(),
        exp: expiry,
    };

    encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .expect("JWT encoding failed")
}

/// Returns the base URL of the backend server.
/// Defaults to http://localhost:8080 if BASE_URL env var is not set.
pub fn base_url() -> String {
    std::env::var("BASE_URL").unwrap_or_else(|_| "http://localhost:8080".to_string())
}

/// Returns the JWT secret from env.
/// You must set TEST_JWT_SECRET in .env (same value as JWT_SECRET in backend).
pub fn jwt_secret() -> String {
    std::env::var("TEST_JWT_SECRET")
        .expect("TEST_JWT_SECRET must be set in .env — it must match the backend's JWT_SECRET")
}
