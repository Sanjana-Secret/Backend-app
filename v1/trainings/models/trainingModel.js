const trainingTable = `
CREATE TABLE IF NOT EXISTS trainings (
    _id int NOT NULL AUTO_INCREMENT,
    training_id varchar(255) NOT NULL,
    course_name varchar(100) NOT NULL,
    course_description varchar(255) NOT NULL,
    roadmap_url varchar(255) NOT NULL,
    details varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    UNIQUE KEY training_id (training_id)
) AUTO_INCREMENT = 1111`;

export default trainingTable; 