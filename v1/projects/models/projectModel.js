const projectTable = `
CREATE TABLE IF NOT EXISTS projects (
    _id int NOT NULL AUTO_INCREMENT,
    category_id INT NOT NULL,
    project varchar(255) NOT NULL,
    client_name varchar(255) NOT NULL,
    project_status varchar(255) NOT NULL,
    project_manager varchar(255) NOT NULL,
    project_lead varchar(255) NOT NULL,
    start_month varchar(255) NOT NULL,
    end_month varchar(255),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default projectTable;