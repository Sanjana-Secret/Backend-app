import pool from "../../../config/db.js";

export const fetchActivityORAnnouncementQuery = (array) => {
    let query = ` SELECT
                title,
                description,
                priority,
                is_new,
                DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
                DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date,
                created_at
            FROM
                announcements 
            WHERE 
                event_type = ?
            ORDER BY
                created_at DESC
            LIMIT 5;`
    return pool.query(query, array);
};

export const userDashboardProfileQuery= async (array) =>{
    try {
        let query = `SELECT 
                    emp_id,
                    profile_picture,
                    CONCAT(first_name, ' ', last_name) AS full_name,
                    designation,
                    mobile_number,
                    DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
                    email
                    FROM users 
                    WHERE emp_id = ?`
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  getUserDataQuery", error);
        throw error;
    }
}

export const updateUserCompletedProjectCountQuery= async (array) =>{
    try {
        let query = `UPDATE users u
        JOIN (
            SELECT emp_id, COUNT(*) AS completed_count
            FROM userProjects
            WHERE STR_TO_DATE(CONCAT('01/', end_month), '%d/%m/%y') <= CURDATE()
            AND emp_id = ?
            GROUP BY emp_id
        ) AS completed_projects
        ON u.emp_id = completed_projects.emp_id
        SET u.completed_projects = completed_projects.completed_count;
        `
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  updateUserCompletedProjectCountQuery", error);
        throw error;
    }
}

export const fetchUserProjectQuery= async (array) =>{
    try {
        let query = `SELECT
        p._id,
        p.project,
        IFNULL(
            PERIOD_DIFF(
                DATE_FORMAT(
                    STR_TO_DATE(
                        CONCAT('01/', IFNULL(u2.end_month, DATE_FORMAT(NOW(), '%m/%y'))),
                        '%d/%m/%y'
                    ),
                    '%Y%m'
                ),
                DATE_FORMAT(
                    STR_TO_DATE(CONCAT('01/', u2.start_month), '%d/%m/%y'),
                    '%Y%m'
                )
            ),
            PERIOD_DIFF(
                DATE_FORMAT(NOW(), '%Y%m'),
                DATE_FORMAT(
                    STR_TO_DATE(CONCAT('01/', u2.start_month), '%d/%m/%y'),
                    '%Y%m'
                )
            )
        ) AS project_duration,
        u2.start_month
    FROM
        users u
    JOIN userProjects u2 ON
        u.emp_id = u2.emp_id
    JOIN projects p ON
        p._id = u2.project_id
    WHERE
        u2.emp_id = ?
        AND YEAR(STR_TO_DATE(CONCAT('01/', u2.start_month), '%d/%m/%y')) = YEAR(CURDATE());
    `;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  getUserProjectQuery", error);
        throw error;
    }
}

export const fetchUserCurrentProjectQuery= async (array) =>{
    try {
            let query = `SELECT 
                        users.completed_projects, 
                        userProjects._id, 
                        projects.project,
                        userProjects.start_month, 
                        userProjects.end_month, 
                        userProjects.tech, 
                        userProjects.project_manager,
                        PERIOD_DIFF(
                            DATE_FORMAT(
                                STR_TO_DATE(CONCAT('01/', IFNULL(userProjects.end_month, DATE_FORMAT(CURDATE(), '%m/%y'))), '%d/%m/%y'),
                                '%Y%m'
                            ),
                            DATE_FORMAT(STR_TO_DATE(CONCAT('01/', userProjects.start_month), '%d/%m/%y'), '%Y%m')
                        ) AS project_duration
                        FROM 
                            userProjects 
                        JOIN 
                            users ON userProjects.emp_id = users.emp_id
                        JOIN 
                            projects ON userProjects.project_id = projects._id
                        WHERE 
                            userProjects.emp_id = ?
                            AND CONCAT(SUBSTRING(userProjects.start_month, 4, 2), SUBSTRING(userProjects.start_month, 1, 2)) <= DATE_FORMAT(CURDATE(), '%y%m')
                            AND (userProjects.end_month IS NULL OR CONCAT(SUBSTRING(userProjects.end_month, 4, 2), SUBSTRING(userProjects.end_month, 1, 2)) > DATE_FORMAT(CURDATE(), '%y%m'))
                        ORDER BY 
                            CONCAT(SUBSTRING(userProjects.start_month, 4, 2), SUBSTRING(userProjects.start_month, 1, 2)) DESC
                        LIMIT 1;`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  fetchUserCurrentProjectQuery", error);
        throw error;
    }
}

export const fetchPointsMonthWiseQuery = (array) => {
    let query = `SELECT emp_id, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, decm FROM  userPerformance WHERE emp_id = ?;`
    return pool.query(query, array);
};

export const fetchPointsYearWiseQuery = (array) => {
    let query = `SELECT emp_id, year, points FROM  userYearlyPerformance WHERE emp_id = ?;`
    return pool.query(query, array);
};
