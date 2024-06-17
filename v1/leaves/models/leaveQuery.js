import pool from "../../../config/db.js"

export const createHoliday = (array) => {
    try {
        let query = `INSERT INTO holidays SET date = ?, holiday = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing createHoliday:", error);
        throw error;
    }
}

export const checkSameHolidayQuery = async (array) => {
    try {
        let query = `SELECT * FROM holidays WHERE date = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing checkSameHolidayQuery:", error);
        throw error;
    }
}

export const fetchHolidayListQuery = async () => {
    try{
        let query = `SELECT _id, date, holiday 
        FROM holidays 
        WHERE YEAR(created_at) = YEAR(CURDATE())`
        return await pool.query(query);
    } catch (error) {
        console.error("Error executing fetchHolidayListQuery:", error);
        throw error;
    }
}

export const getHolidayDataQuery = async (array)=>{
    try{
    let query = `SELECT date, holiday FROM holidays WHERE _id = ? `
    return  await pool.query(query, array);
    }catch(error){
        console.error("Error executing getHolidayDataQuery:", error);
        throw error;
    } 
};

export const deleteHolidayQuery = async (array) => {
    try{
        let query = `DELETE FROM holidays WHERE _id = ? `
        return await pool.query(query, array); 
    }catch(error){
        console.error("Error executing deleteHolidayQuery:", error);
        throw error;
    }
}

export const updateHolidayQuery = (query, array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateHolidayQuery:", error);
        throw error;
    }
}

export const checkSameLeaveTypeNameQuery = (array) => {
    try {
        let query = `SELECT * FROM leaveTypes WHERE leave_type = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkSameLeaveTypeNameQuery:", error);
        throw error; 
    }
}

export const createLeaveType = (array) => {
    try {
        let query = `INSERT INTO leaveTypes SET leave_type = ?, description = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing createLeaveType:", error);
        throw error; 
    }
}

export const fetchLeavesTypesQuery = () => {
    try {
        let query = `SELECT _id, leave_type, description FROM leaveTypes`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchLeavesTypesQuery:", error);
        throw error; 
    }
}

export const getLeavesTypesQuery = (array) => {
    try {
        let query = `SELECT * FROM leaveTypes WHERE _id = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing fetchLeavesTypesQuery:", error);
        throw error; 
    }
}

export const deleteLeaveTypeQuery = async (array) => {
    try{
        let query = `DELETE FROM leaveTypes WHERE _id = ? `
        return await pool.query(query, array); 
    }catch(error){
        console.error("Error executing deleteLeaveTypeQuery:", error);
        throw error;
    }
}

export const updateLeaveQuery = (query, array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateLeaveQuery:", error);
        throw error;
    }
}

export const createLeaveCount = (array) => {
    try {
        let query = `INSERT INTO leaveTypeCounts SET leave_type_id = ?, leave_type = ?, leave_count = ?, gender = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing createLeaveCount:", error);
        throw error;   
    }
}

export const deleteLeaveTypeAndCountQuery = async (array) => {
    try {
        let query = `DELETE FROM leaveTypeCounts WHERE _id = ? AND leave_type_id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteLeaveTypeAndCountQuery:", error);
        throw error;
    }
}

export const fetchLeavesCountQuery = () => {
    try {
        let query = `SELECT leaveTypeCounts._id, leaveTypeCounts.leave_type_id, leaveTypeCounts.leave_type, leaveTypeCounts.leave_count, lt.description, leaveTypeCounts.gender
        FROM leaveTypeCounts
        JOIN leaveTypes AS lt ON lt._id = leaveTypeCounts.leave_type_id;
        `
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchLeavesCountQuery:", error);
        throw error; 
    }
}

export const fetchLeaveTakenOverviewQuery = (array, date) => {
    try {
        let query = `SELECT leave_type, from_date, to_date, subject FROM leaveDatesAndReasons WHERE emp_id = ? AND status = ?`
        if (date) {
            query += ` AND DATE(from_date) = ?`;
            array.push(date);
        }
        query += ` ORDER BY created_at DESC`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing fetchLeaveTakenOverviewQuery:", error);
        throw error; 
    }
}

export const insertUserLeaveDataQuery = (array) => {
    try {
        let query = `INSERT INTO leaveDatesAndReasons (
            emp_id,
            leave_type,
            from_date,
            to_date,
            subject,
            body
        ) VALUES (?,?,?,?,?,?);`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveDataQuery:", error);
        throw error; 
    }
}

export const insertApprovalForLeaveQuery = (array) => {
    try {
        const query = `INSERT INTO approvals(
            emp_id,
            foreign_id,
            request_type,
            item,
            request_date,
            issued_from,
            issued_till,
            subject,
            body
        ) VALUES (?,?,?,?,?,?,?,?,?);`
        return pool.query(query, array)
    } catch (error) {
        console.error("Error executing insertApprovalForLeaveQuery:", error);
        throw error; 
    }
}

export const getLastLeaveId = () => {
    try {
        let query = `SELECT _id from leaveDatesAndReasons ORDER BY _id DESC LIMIT 1`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getLastLeaveId:", error);
        throw error;
    }
}

export const getLeaveTypeCountByAdmin = async (array) => {
    try {
        let query = `SELECT leave_count FROM leaveTypeCounts WHERE leave_type = ?;`
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing getLeaveTypeCountByAdmin:", error);
        throw error;
    }
}

export const getAllUsersLeaveCountQuery = async (array)=>{
    try {
        let query = 
        `SELECT emp_id, leave_type, leave_count, leave_taken_count 
        FROM userLeaveCounts
        WHERE emp_id = ?
        GROUP BY emp_id, leave_type, leave_count, leave_taken_count;
        `
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing getAllUsersLeaveCountQuery:", error);
        throw error;
    }
}

export const getUserLeaveDataQuery = async(array)=>{
    try {
        let query = `
        SELECT leave_type, leave_count, leave_taken_count 
        FROM
            userLeaveCounts
        WHERE emp_id = ?;
        `
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserLeaveDataQuery:", error);
        throw error;
    }
}
export const getallUserLeaveDataQuery = async(array)=>{
    try {
        let query = `
        SELECT _id,
        DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
        DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date,
        leave_type,
        DATEDIFF(to_date,from_date) + 1 AS total_days,
        status,
        'HR' AS manager
        FROM leaveDatesAndReasons
        WHERE emp_id = ?
        `
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing allGetUserLeaveDataQuery:", error);
        throw error;
    }
}