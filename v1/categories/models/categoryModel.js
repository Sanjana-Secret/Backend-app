const categoryTable = `
CREATE TABLE IF NOT EXISTS categories (
    _id int NOT NULL AUTO_INCREMENT,
    category varchar(255) NOT NULL,
    points INT NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default categoryTable;