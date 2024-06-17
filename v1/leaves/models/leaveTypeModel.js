const leaveTypeTable = `
CREATE TABLE IF NOT EXISTS leaveTypes (
    _id int NOT NULL AUTO_INCREMENT,
    leave_type varchar(50) NOT NULL,
    description varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111;
`
export default leaveTypeTable