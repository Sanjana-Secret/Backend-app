const holidays = `
CREATE TABLE IF NOT EXISTS holidays (
    _id int NOT NULL AUTO_INCREMENT,
    date date NOT NULL,
    day varchar(45) DEFAULT NULL,
    holiday varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111;
`
export default holidays