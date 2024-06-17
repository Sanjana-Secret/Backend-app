import pool from "../../../config/db.js"

export const getCategoryTotalPointsQuery = async () => {
    try {
        let query = `SELECT SUM(points) AS total_points FROM categories;`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getCategoryTotalPoints:", error);
        throw error;
    }
}

export const getUserPointsQuery = (array) => {
    try {
        let query = `SELECT w.emp_id,
            SUM(c.points) AS total_earned_points
            FROM worksheets w
            JOIN categories c ON w.category_id = c._id
            WHERE YEAR(w.date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
            AND MONTH(w.date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            GROUP BY w.emp_id;`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getAllEmployees:", error);
        throw error;
    }
}

export const getTeamPointsQuery = () => {
    try {
        let query = `SELECT t._id,
            SUM(c.points) AS team_total_earned_points
            FROM worksheets w
            JOIN teams t ON w.team_id = t._id
            JOIN categories c ON w.category_id = c._id
            WHERE w.date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
            GROUP BY t._id;`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getTeamPointsQuery:", error);
        throw error;
    }
}

export const updateUserPerformanceQuery = (array) =>{
    try {
        let query = `UPDATE users SET performance = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserPerformanceQuery:", error);
        throw error;
    }
}

export const fetchTeamCountQuery = () => {
    try {
        let query = `SELECT team_id, COUNT(user_id) AS total_users
        FROM userTeams
        GROUP BY team_id;`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchTeamCountQuery:", error);
        throw error;
    }
}

export const fetchTeamNameQuery = (array) => {
    try {
        let query = `SELECT _id, team FROM teams WHERE _id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing fetchTeamNameQuery:", error);
        throw error;
    }
}

export const updateUserPointsQuery = (month, performance, emp_id) =>{
    try {
        let query = `UPDATE userPerformance SET ${month} = ? WHERE emp_id = ?;`
        return pool.query(query, [performance, emp_id]);
    } catch (error) {
        console.error("Error executing updateUserPointsQuery:", error);
        throw error;
    }
}

export const insertYearlyDataOfUsersPerformanceQuery = (year) =>{
    try {
        let query =`INSERT INTO userYearlyPerformance (emp_id, points, year)
                    SELECT emp_id, 
                        (COALESCE(jan, 0) + COALESCE(feb, 0) + COALESCE(mar, 0) + COALESCE(apr, 0) +
                            COALESCE(may, 0) + COALESCE(jun, 0) + COALESCE(jul, 0) + COALESCE(aug, 0) +
                            COALESCE(sep, 0) + COALESCE(oct, 0) + COALESCE(nov, 0) + COALESCE(decm, 0)) AS total,
                        ? AS year
                    FROM userPerformance;`
        return pool.query(query, [year]);
    } catch (error) {
        console.error("Error executing getAllUsersQuery:", error);
        throw error;
    }
}