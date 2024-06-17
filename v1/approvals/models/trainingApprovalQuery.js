import pool from "../../../config/db.js"

export const insertApprovalForTrainingQuery=(array)=>{
    const query = `INSERT INTO approvals(
        emp_id,
        foreign_id,
        request_type,
        item,
        request_date,
        subject,
        body
    ) VALUES (?,?,?,?,?,?,?);`
    return pool.query(query, array)
}

export const fetchTrainingDataQuery=(array)=>{
    const query = `SELECT * FROM userTrainings WHERE emp_id = ? AND training_id = ? ;`
    return pool.query(query, array)
}

export const trainingApprovalQuery = async(array1, array2) => {
    const query1 = `UPDATE userTrainings
    SET status = ? 
    WHERE emp_id = ? AND training_id = ?`

    const query2 = `UPDATE approvals
    SET
        status = ?,
        approval_date = ?
    WHERE
        emp_id = ? AND
        foreign_id = ?;`
    pool.query(query1, array1)
    pool.query(query2, array2)
}

export const deleteTrainingQuery = async (array) => {
    const query1 = `
        DELETE FROM approvals 
        WHERE foreign_id = ? AND emp_id = ?;
    `;
    const query2 = `
        DELETE FROM userTrainings 
        WHERE training_id = ? AND emp_id = ?;
    `
    pool.query(query1, array);
    pool.query(query2, array);
};

export const trainingRejectionQuery = async(array1, array2) => {
    const query1 = `UPDATE userTrainings 
    SET status = ?
    WHERE emp_id = ? AND training_id = ?;
    `
    const query2 = `UPDATE approvals
    SET status = ?
    WHERE emp_id = ?
     AND foreign_id = ?`
    pool.query(query1, array1)
    pool.query(query2, array2)
}