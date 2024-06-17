const imagesTable = `
CREATE TABLE IF NOT EXISTS images (
    _id int NOT NULL AUTO_INCREMENT,
    type ENUM('profile', 'dashboard', 'activity', 'asset') NOT NULL,
    emp_id varchar(255), 
    activity_id int DEFAULT NULL,
    asset_id varchar(255),
    image_url varchar(255) NOT NULL,
    public_id varchar(255) NOT NULL,
    original_filename varchar(255) NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default imagesTable; 