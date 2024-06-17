const teamTable = `
CREATE TABLE IF NOT EXISTS teams (
    _id int NOT NULL AUTO_INCREMENT,
    team varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default teamTable;