const userYearlyPerformanceTable = `
CREATE TABLE IF NOT EXISTS userYearlyPerformance (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    year int DEFAULT 0,
    points int DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111`;

export default userYearlyPerformanceTable;