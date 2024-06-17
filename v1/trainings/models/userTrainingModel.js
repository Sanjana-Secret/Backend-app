const usertrainingTable = `
CREATE TABLE IF NOT EXISTS userTrainings (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    training_id varchar(255) NOT NULL,
    course_name varchar(100) NOT NULL,
    course_description varchar(255) NOT NULL,
    details varchar(255) NOT NULL,
    roadmap_url varchar(255) NOT NULL,
    status ENUM('rejected', 'approved', 'pending') DEFAULT 'pending' NOT NULL,
    progress_status ENUM('completed', 'in progress'),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (training_id) REFERENCES trainings(training_id) ON DELETE CASCADE,
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111`;

export default usertrainingTable; 