const assetRequestTable = `CREATE TABLE IF NOT EXISTS userAssets (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    asset_type varchar(50) NOT NULL,
    asset_id varchar(255),
    item varchar(50),
    item_details varchar(255),
    warranty_period int,
    requirement_type varchar(50),
    primary_purpose varchar(255),
    model_number varchar(50),
    issued_till date,
    issued_from date,
    status ENUM('rejected', 'approved', 'pending') DEFAULT 'pending' NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE,
    UNIQUE KEY asset_id (asset_id)
) AUTO_INCREMENT = 1111`;

export default assetRequestTable;