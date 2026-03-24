use diesel::{prelude::*};
use diesel::pg::PgConnection;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::schema;


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



trait _Dbfunctions {
//fn create( conn: &mut PgConnection, job: &Job ) -> Result<Job, diesel::result::Error>;
 //fn update(&mut self , conn: &mut PgConnection) -> Result<Job, diesel::result::Error>;    
 //fn findbyid (conn: &mut PgConnection, id: Uuid) -> Result<Job, diesel::result::Error>;
}
//function to update the job status 
pub struct UpdateJobRequest {
    pub job_id: Uuid,
    pub status : String,
    pub stage : String,
}

/// Changeset struct for writing the on-chain USDC ATA pubkey back to the user row.
#[derive(AsChangeset)]
#[diesel(table_name = crate::schema::jobs)]
pub struct UpdateJobStatus {
    pub id: Uuid,
    pub status : String,
    pub stage : String,
}

//creating the related datbase function
impl  Job {
   //create the model functions 
  pub fn create(conn: &mut PgConnection, job: &Job) -> Result<Job, diesel::result::Error> {
    use crate::schema::jobs;

    //create the new job 
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

  //query database to update the job status 
    let result = diesel::insert_into(jobs::table)
        .values(&new_job)
        .returning(Job::as_returning())
        .get_result(conn)?;

    Ok(result)
}

//update the job 
pub fn update_job_status (conn: &mut PgConnection, job: UpdateJobRequest) -> Result<Job, diesel::result::Error>{
    use crate::schema::jobs::dsl::*;
    
   let change_set = UpdateJobStatus{
    id: job.job_id,
    status: job.status,
    stage: job.stage,
   };
  
  //query database to update the job status 
   let result = diesel::update(jobs.filter(id.eq(job.job_id))).set(&change_set).get_result(conn)?;
 
  //for further optimization 
  //use match statement to handle the database query
   Ok(result)
}
}
