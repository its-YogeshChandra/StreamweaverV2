use diesel::prelude::*;
use diesel::pg::PgConnection;
use chrono::{DateTime, Utc};
use uuid::Uuid;
//create the respective struct for the job 

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::jobs)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Job {
    pub id: Uuid,
    pub api_key_id: Uuid,
    pub status: String,
    pub stage: Option<String>,
    pub progress: Option<i32>,
    pub file_path: String,
    pub file_size: Option<i64>,
    pub original_name: Option<String>,
    pub threat_level: Option<String>,
    pub output_urls: Option<serde_json::Value>,
    pub metadata: Option<serde_json::Value>,
    pub error_message: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

//struct for the new job 
#[derive(Insertable)]
#[diesel(table_name = crate::schema::jobs)]
pub struct NewJob {
    pub id: Uuid,
    pub api_key_id: Uuid,
    pub status: String,
    pub stage: Option<String>,
    pub progress: Option<i32>,
    pub file_path: String,
    pub file_size: Option<i64>,
    pub original_name: Option<String>,
    pub threat_level: Option<String>,
    pub output_urls: Option<serde_json::Value>,
    pub metadata: Option<serde_json::Value>,
    pub error_message: Option<String>,
    // created_at and updated_at are handled by DB defaults
}



trait Dbfunctions {
//fn create( conn: &mut PgConnection, job: &Job ) -> Result<Job, diesel::result::Error>;
 //fn update(&mut self , conn: &mut PgConnection) -> Result<Job, diesel::result::Error>;    
 //fn findbyid (conn: &mut PgConnection, id: Uuid) -> Result<Job, diesel::result::Error>;
}

//creating the related datbase function
impl  Job {
   //create the model functions 
  pub fn create(conn: &mut PgConnection, job: &Job) -> Result<Job, diesel::result::Error> {
    use crate::schema::jobs;

    let new_job = NewJob{
        id: job.id,
        api_key_id: job.api_key_id,
        status: job.status.clone(),
        stage: job.stage.clone(),
        progress: job.progress,
        file_path: job.file_path.clone(),
        file_size: job.file_size,
        original_name: job.original_name.clone(),
        threat_level: job.threat_level.clone(),
        output_urls: job.output_urls.clone(),
        metadata: job.metadata.clone(),
        error_message: job.error_message.clone(),
    };

    //insert it into the postgres 
    let result = diesel::insert_into(jobs::table)
        .values(&new_job)
        .returning(Job::as_returning())
        .get_result(conn)?;

    Ok(result)
}
}