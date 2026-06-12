use diesel::prelude::*;
use diesel::pg::PgConnection;
use chrono::{DateTime, Utc};
use uuid::Uuid;

//struct for reading encryption keys from the database
#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::encryption_keys)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct EncryptionKey {
    pub id: Uuid,
    pub job_id: Uuid,
    pub key_index: i32,
    pub key_bytes: Vec<u8>,
    pub created_at: Option<DateTime<Utc>>,
}

//struct for inserting a new encryption key
#[derive(Insertable)]
#[diesel(table_name = crate::schema::encryption_keys)]
pub struct NewEncryptionKey {
    pub id: Uuid,
    pub job_id: Uuid,
    pub key_index: i32,
    pub key_bytes: Vec<u8>,
}

impl EncryptionKey {
    //create a new encryption key in the database
    pub fn create(conn: &mut PgConnection, job_uuid: Uuid, index: i32, raw_key: Vec<u8>) -> Result<EncryptionKey, diesel::result::Error> {
        use crate::schema::encryption_keys;

        let new_key = NewEncryptionKey {
            id: Uuid::new_v4(),
            job_id: job_uuid,
            key_index: index,
            key_bytes: raw_key,
        };

        let result = diesel::insert_into(encryption_keys::table)
            .values(&new_key)
            .returning(EncryptionKey::as_returning())
            .get_result(conn)?;

        Ok(result)
    }

    //get encryption key by job_id
    pub fn get_by_job_id(conn: &mut PgConnection, target_job_id: Uuid) -> Result<Vec<EncryptionKey>, diesel::result::Error> {
        use crate::schema::encryption_keys::dsl::*;

        let results = encryption_keys
            .filter(job_id.eq(target_job_id))
            .order(key_index.asc())
            .load::<EncryptionKey>(conn)?;

        Ok(results)
    }
}
