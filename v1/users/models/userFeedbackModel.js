const feedbackFormTable = `
CREATE TABLE IF NOT EXISTS feedback (
    _id INT AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    subject varchar(45) NOT NULL,
    date date,
    description varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
  ) AUTO_INCREMENT = 1111;`;
  export default feedbackFormTable;
