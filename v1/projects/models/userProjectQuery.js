import pool from "../../../config/db.js"

export const insertUserProjectQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userProjects(
            project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager
        )VALUES (?,?,?,?,?,?,?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserProjectQuery:", error);
        throw error;
    }
}

export const getUserProjectQuery = async (array) => {
    try {
        let query = `SELECT * 
                    FROM userProjects 
                    WHERE emp_id = ?
                    AND CONCAT(SUBSTRING(start_month, 4, 2), SUBSTRING(start_month, 1, 2)) <= DATE_FORMAT(CURDATE(), '%y%m')
                    AND CONCAT(SUBSTRING(end_month, 4, 2), SUBSTRING(end_month, 1, 2)) > DATE_FORMAT(CURDATE(), '%y%m')
                  ORDER BY CONCAT(SUBSTRING(start_month, 4, 2), SUBSTRING(start_month, 1, 2)) DESC
                    LIMIT 1`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}

export const checkProjectIdQuery = async (array) => {
    try {
        let query = `SELECT * FROM userProjects WHERE emp_id = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing checkSameTeamNameQuery:", error);
        throw error;
    }
}

export const userUpdateProjectQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateProjectWorksheetQuery:", error);
        throw error;
    }
}

export const getUserProjectTimelineQuery = async (array) => {
    try {
        let query = `SELECT userProjects._id, userProjects.emp_id, userProjects.start_month, userProjects.end_month, projects.project, projects.client_name, teams.team
                    FROM userProjects
                    JOIN projects ON userProjects.project_id = projects._id
                    LEFT JOIN teams ON userProjects.team_id = teams._id
                    WHERE emp_id = ? `
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}