const announcementTable = `
CREATE TABLE IF NOT EXISTS announcements (
    _id int NOT NULL AUTO_INCREMENT,
    event_type varchar(20) NOT NULL,
    priority ENUM ('low', 'medium', 'high') DEFAULT 'low' NOT NULL,
    from_date date,
    to_date date,
    title varchar(255),
    description varchar(255),
    is_new TINYINT(1) DEFAULT 1,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;


export default announcementTable
