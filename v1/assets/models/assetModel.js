const assetTable = `
CREATE TABLE IF NOT EXISTS assets (
    _id int NOT NULL AUTO_INCREMENT,
    asset_id varchar(255) NOT NULL,
    asset_type varchar(50) NOT NULL,
    item varchar(50) NOT NULL,
    purchase_date date,
    warranty_period int NOT NULL,
    price int NOT NULL,
    model_number varchar(50) NOT NULL,
    item_description varchar(255) NOT NULL,
    image_url varchar(255) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    UNIQUE KEY asset_id (asset_id)
) AUTO_INCREMENT = 1111`;


export default assetTable
