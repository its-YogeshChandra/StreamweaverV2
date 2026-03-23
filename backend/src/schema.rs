// @generated automatically by Diesel CLI.

diesel::table! {
    api_keys (id) {
        id -> Uuid,
        name -> Text,
        key_hash -> Text,
        webhook_url -> Nullable<Text>,
        webhook_secret -> Nullable<Text>,
        rate_limit -> Nullable<Int4>,
        is_active -> Nullable<Bool>,
        created_at -> Nullable<Timestamptz>,
        updated_at -> Nullable<Timestamptz>,
    }
}

diesel::table! {
    encryption_keys (id) {
        id -> Uuid,
        job_id -> Uuid,
        key_index -> Int4,
        key_bytes -> Bytea,
        created_at -> Nullable<Timestamptz>,
    }
}

diesel::table! {
    jobs (id) {
        id -> Uuid,
        api_key_id -> Uuid,
        status -> Text,
        stage -> Nullable<Text>,
        progress -> Nullable<Int4>,
        file_path -> Text,
        file_size -> Nullable<Int8>,
        original_name -> Nullable<Text>,
        threat_level -> Nullable<Text>,
        output_urls -> Nullable<Jsonb>,
        metadata -> Nullable<Jsonb>,
        error_message -> Nullable<Text>,
        created_at -> Nullable<Timestamptz>,
        updated_at -> Nullable<Timestamptz>,
    }
}

diesel::joinable!(encryption_keys -> jobs (job_id));

diesel::allow_tables_to_appear_in_same_query!(api_keys, encryption_keys, jobs,);
