const skillSetTable = `
CREATE TABLE IF NOT EXISTS skillSets (
    _id int NOT NULL AUTO_INCREMENT,
    skill varchar(50) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default skillSetTable;