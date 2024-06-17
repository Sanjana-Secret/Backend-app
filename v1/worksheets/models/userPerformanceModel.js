const userPerformanceTable = `
CREATE TABLE IF NOT EXISTS userPerformance (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    jan int DEFAULT 0,
    feb int DEFAULT 0,
    mar int DEFAULT 0,
    apr int DEFAULT 0,
    may int DEFAULT 0,
    jun int DEFAULT 0,
    jul int DEFAULT 0,
    aug int DEFAULT 0,
    sep int DEFAULT 0,
    oct int DEFAULT 0,
    nov int DEFAULT 0,
    decm int DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    UNIQUE (emp_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111`;

export default userPerformanceTable;