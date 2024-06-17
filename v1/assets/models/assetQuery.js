import pool from "../../../config/db.js"

export const insertAssetQuery = (array)=> {
    let query = `INSERT INTO assets (
        asset_id,
        asset_type,
        item,
        purchase_date,
        warranty_period,
        price,
        model_number,
        item_description,
        image_url,
        created_at,
        updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const getLastAssetIdQuery = () =>{
    let query = `SELECT * FROM assets ORDER BY asset_id DESC LIMIT 1`
    return pool.query(query);
}
export const getAssetDataQuery = (array) =>{
    let query = `SELECT * FROM assets WHERE asset_id = ?`
    return pool.query(query, array);
}

export const insertUserAssetDataQuery = (array)=> {
    let query = `INSERT INTO userAssets (
        emp_id,
        asset_type,
        item,
        requirement_type,
        primary_purpose,
        item_details
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const fetchUserAssetsQuery = (array) => {
    let query = `
    SELECT CONCAT(u.first_name, ' ', u.last_name) AS name,u.emp_id, ua.asset_type, ua.asset_id, ua.item, ua.requirement_type,
    ua.status, ua.issued_from, ua.issued_till, COALESCE(a.warranty_period, NULL) AS warranty_period, 'HR' AS manager
    FROM userAssets as ua
    JOIN users as u ON ua.emp_id = u.emp_id
    LEFT JOIN assets as a ON ua.asset_id = a.asset_id
    WHERE ua.emp_id = ?;`
    return pool.query(query, array);
}

export const fetchAssetsQuery = (array) => {
    let query = `
    SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS assignee, 
    a.asset_id, 
    a.purchase_date, 
    images.image_url, 
    a.item, 
    a.item_description, 
    ua.issued_from, 
    ua.issued_till, 
    a.warranty_period,
    images.public_id,
    images.original_filename    
FROM 
    assets AS a
LEFT JOIN 
    userAssets AS ua ON a.asset_id = ua.asset_id
LEFT JOIN
    images ON a.asset_id = images.asset_id 
LEFT JOIN 
    users AS u ON u.emp_id = ua.emp_id`
    return pool.query(query, array);
}


export const deleteAssetQuery = async (array) => {
    const query = `
        DELETE FROM assets 
        WHERE asset_id = ?;
    `;
    return pool.query(query, array);
};

export const updateAssetQuery = (query, array)=>{
    return pool.query(query, array);
}