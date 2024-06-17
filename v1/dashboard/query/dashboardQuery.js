import pool from "../../../config/db.js";

export const fetchEmployeeCountQuery = () => {
    try{
        let sql = `
        SELECT team_id, team , COUNT(*) AS num_employees
        FROM userteams join teams on userteams.team_id = teams._id
        GROUP BY team_id;
  `;
    return pool.query(sql);
    }catch(err){
        console.log("Error in executing the fetchEmployeeCountQuery : " , err);
        throw(err)
    }
}

export const getMonthlyProjectCountQuery = () =>{
    try {
        let query = `WITH RECURSIVE months AS (
            SELECT DATE_FORMAT(CURRENT_DATE - INTERVAL 0 MONTH, '%Y-%m-01') AS month_start
            UNION ALL
            SELECT DATE_FORMAT(month_start - INTERVAL 1 MONTH, '%Y-%m-01')
            FROM months
            WHERE month_start > DATE_FORMAT(CURRENT_DATE - INTERVAL 11 MONTH, '%Y-%m-01')
        )
        SELECT
            DATE_FORMAT(months.month_start, '%M %y') AS month_start,
            COUNT(DISTINCT projects._id) AS live_projects
        FROM
            months
        LEFT JOIN
            projects ON STR_TO_DATE(CONCAT(projects.start_month, '-01'), '%b %y-%d') <= LAST_DAY(months.month_start)
                      AND STR_TO_DATE(CONCAT(projects.end_month, '-01'), '%b %y-%d') >= months.month_start
        GROUP BY
            months.month_start
        ORDER BY
            months.month_start;
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getMonthlyProjectCountQuery:", error);
        throw error;
    }
}

export const getProjectCountBasedOnTeamQuery = () =>{
    try {
        let query = `SELECT
                    t._id,
                    t.team,
                    COUNT(DISTINCT p._id) AS project_count
                FROM
                    projects p
                JOIN 
                   userProjects up ON up.project_id = p._id
                JOIN
                    teams t ON up.team_id = t._id
                WHERE
                    STR_TO_DATE(CONCAT('01 ', IFNULL(p.start_month, '')), '%d %b %y') <= CURDATE()
                    AND (STR_TO_DATE(CONCAT('01 ', IFNULL(p.end_month, '')), '%d %b %y') >= CURDATE() OR p.end_month IS NULL)
                GROUP BY
                    t._id, t.team;
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getUserCountOnClientProjectBasedOnTeamQuery:", error);
        throw error;
    }
}

export const getTotalProjectsQuery = () =>{
    try {
        let query = `SELECT COUNT(DISTINCT _id) AS total_live_projects 
        FROM projects
        WHERE
            STR_TO_DATE(CONCAT('01 ', start_month), '%d %b %y') <= CURDATE()
            AND (STR_TO_DATE(CONCAT('01 ', end_month), '%d %b %y') >= CURDATE() OR end_month IS NULL);`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getTotalProjectsQuery:", error);
        throw error;
    }
}

export const getUserCountOnClientProjectQuery = () =>{
    try {
        let query = `SELECT
                    COUNT(DISTINCT up.emp_id) AS employee_with_client_count,
                    (
                        SELECT
                            COUNT(DISTINCT emp_id)
                        FROM
                            users
                    ) AS total_employee_count
                FROM
                    userProjects up
                WHERE
                    CONCAT(SUBSTRING(IFNULL(up.start_month, ''), 4, 2), SUBSTRING(IFNULL(up.start_month, ''), 1, 2)) <= DATE_FORMAT(CURDATE(), '%y%m')
                    AND (CONCAT(SUBSTRING(IFNULL(up.end_month, ''), 4, 2), SUBSTRING(IFNULL(up.end_month, ''), 1, 2)) >= DATE_FORMAT(CURDATE(), '%y%m') OR up.end_month IS NULL);
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getUserCountOnClientProjectQuery:", error);
        throw error;
    }
}

export const getEmployeeTeamCountQuery = () =>{
    try {
        let query = `SELECT
                        t._id,
                        t.team,
                        COUNT(DISTINCT ut.user_id) AS employee_count
                    FROM
                        userTeams ut
                    JOIN
                        teams t ON ut.team_id = t._id
                    GROUP BY
                        t._id, t.team
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getEmployeeTeamCountQuery:", error);
        throw error;
    }
}

export const fetchAllProjectsDataQuery = () =>{
    try {
        let query = `SELECT
                    _id, client_name, project_lead, project, project_status
                    FROM projects;
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchAllProjectsDataQuery:", error);
        throw error;
    }
}

export const fetchApprovalDataQuery = () =>{
    try {
        let query = `SELECT
                        approvals._id,
                        approvals.emp_id,
                        CONCAT(users.first_name, ' ', users.last_name) AS full_name,
                        approvals.foreign_id,
                        approvals.request_type,
                        approvals.item,
                        approvals.status,
                        approvals.subject,
                        approvals.body,
                        approvals.request_date
                    FROM
                        approvals
                    JOIN
                        users ON users.emp_id = approvals.emp_id
                    ORDER BY
                        approvals.created_at DESC;

        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchApprovalDataQuery:", error);
        throw error;
    }
}