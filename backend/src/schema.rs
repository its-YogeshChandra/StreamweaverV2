// @generated automatically by Diesel CLI.

diesel::table! {
    api_keys (id) {
        id -> Uuid,
        name -> Text,
        key_hash -> Text,
        webhook_url -> Nullable<Text>,
        webhook_secret -> Nullable<Text>,
        rate_limit -> Int4,
        is_active -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    encryption_keys (id) {
        id -> Uuid,
        job_id -> Uuid,
        key_index -> Int4,
        key_bytes -> Bytea,
        created_at -> Timestamp,
    }
}

diesel::table! {
    jobs (id) {
        id -> Uuid,
        api_key_id -> Uuid,
        status -> Text,
        stage -> Nullable<Text>,
        progress -> Int4,
        file_path -> Text,
        file_size -> Nullable<Int8>,
        original_name -> Nullable<Text>,
        threat_level -> Nullable<Text>,
        output_urls -> Nullable<Jsonb>,
        metadata -> Nullable<Jsonb>,
        error_message -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(encryption_keys -> jobs (job_id));
diesel::joinable!(jobs -> api_keys (api_key_id));

diesel::allow_tables_to_appear_in_same_query!(api_keys, encryption_keys, jobs,);
