import pool from "../../../config/db.js"
export const insertUserWorksheetQuery = async (array) => {
    try {
        let query = `INSERT INTO worksheets (emp_id, team_id, project_id, category_id, skill_set_id, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserWorksheetQuery:", error);
        throw error;
    }
}

export const updateUserWorksheetQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserWorksheetQuery:", error);
        throw error;
    }
}

export const deleteUserWorksheetQuery = async (array) => {
    try {
        let query = `DELETE FROM worksheets WHERE _id = ? AND emp_id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteTeamQuery:", error);
        throw error;
    }
}
export const fetchUserWorksheetQuery = async (empId) => {
    try {
        let query = `SELECT w.*, p.project, c.category, t.team
            FROM worksheets as w
            LEFT JOIN projects AS p ON w.project_id = p._id
            LEFT JOIN categories AS c ON w.category_id = c._id
            LEFT JOIN teams AS t ON w.team_id = t._id
            WHERE emp_id = ? 
            ORDER BY date DESC`;
        return await pool.query(query, [empId]);
    } catch (error) {
        console.error("Error executing fetchUserWorksheetQuery:", error);
        throw error;
    }
}