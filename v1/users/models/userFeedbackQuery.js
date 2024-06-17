import pool from "../../../config/db.js";

export const feedbackFormQuery= async(array)=>{
    let query= `INSERT INTO feedback (
        emp_id,
        date,
        subject,
        description
    )VALUE (?,?,?,?)`;
    return pool.query(query, array);
}

export const fetchFeebackQuery = (array) =>{
    try {
        let query = `SELECT * FROM feedback ORDER BY date DESC LIMIT 10`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing fetchFeebackQuery:", error);
        throw error;
    }
}
