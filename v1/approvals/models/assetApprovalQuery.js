import pool from "../../../config/db.js"

export const assetApprovalQuery = async(array1, array2) => {
    const query1 = `UPDATE userAssets 
    SET asset_id = ?, issued_from = ?, status = ? 
    WHERE emp_id = ? AND item = ?;
    `
    const query2 = `UPDATE approvals
    SET status =?, 
        approval_date = ?,
        issued_from = ?, 
        foreign_id = ?
    WHERE emp_id = ?
     AND item = ?`
    pool.query(query1, array1)
    pool.query(query2, array2)
}
export const assetRejectionQuery = async(array1, array2) => {
    const query1 = `UPDATE userAssets 
    SET status = ? 
    WHERE emp_id = ? AND item = ?;
    `
    const query2 = `UPDATE approvals
    SET status =?
    WHERE emp_id = ?
     AND item = ?`
    pool.query(query1, array1)
    pool.query(query2, array2)
}

export const insertApprovalQuery=(array)=>{
    const query = `INSERT INTO approvals(
        emp_id,
        request_type,
        item,
        request_date,
        subject,
        body
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array)
}

export const deleteAssetQuery = async (array) => {
    const query1 = `
        DELETE FROM approvals 
        WHERE foreign_id = ? AND emp_id = ?;
    `;
    const query2 = `
        DELETE FROM userAssets 
        WHERE asset_id = ? AND emp_id = ?;
    `
    pool.query(query1, array);
    pool.query(query2, array);
};



export const fetchAssetDataQuery=(array)=>{
    const query = `SELECT * FROM userAssets WHERE emp_id = ? AND item = ?;`
    return pool.query(query, array)
}