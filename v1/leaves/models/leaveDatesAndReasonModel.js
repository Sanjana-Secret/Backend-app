const leaveDatesAndReasonTable = `
CREATE TABLE IF NOT EXISTS leaveDatesAndReasons (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    leave_type varchar(255) NOT NULL,
    status ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending',
    from_date date NOT NULL,
    to_date date NOT NULL,
    subject varchar(255) NOT NULL,
    body varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111;
`
export default leaveDatesAndReasonTable