const leaveTypeCountTable = `
CREATE TABLE IF NOT EXISTS leaveTypeCounts (
    _id int NOT NULL AUTO_INCREMENT,
    leave_type_id int NOT NULL,
    leave_type varchar(255) NOT NULL,
    gender ENUM ('male', 'female', 'both') DEFAULT 'both',
    leave_count int NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (leave_type_id) REFERENCES leaveTypes(_id) ON UPDATE CASCADE ON DELETE CASCADE
) AUTO_INCREMENT = 1111;
`
export default leaveTypeCountTable