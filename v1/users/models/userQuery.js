import pool from "../../../config/db.js"


export const getUserDataByUsernameQuery = (array)=> {
    try {
        let query = `SELECT * FROM users WHERE username = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserDataByUsernameQuery:", error);
        throw error;
    }
}

export const userRegistrationQuery = (array)=> {
    try {
        let query = `INSERT INTO users (
            emp_id,
            username,
            password,
            first_name,
            last_name,
            email,
            gender,
            profile_picture, 
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            teams,
            client_report,
            role
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userRegistrationQuery:", error);
        throw error;
    }
}

export const userDetailQuery = (array)=>{
    try {
        let query = `SELECT * FROM users WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userDetailQuery:", error);
        throw error;
    }
}

export const checkUserNameAvailabilityQuery = (array)=>{
    try {
        let query = `SELECT * FROM users WHERE username = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing userDetailQuery:", error);
        throw error;
    }
}

export const updateTokenQuery = (array) => {
    try {
        let query = `UPDATE users SET jwt_token = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateTokenQuery:", error);
        throw error;
    }
}
export const getLastEmployeeIdQuery = () =>{
    try {
        let query = `SELECT * FROM users ORDER BY emp_id DESC LIMIT 1`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getLastEmployeeIdQuery:", error);
        throw error;
    }
}

export const updateUserPasswordQuery = (array) =>{
    try {
        let query = `UPDATE users SET password = ? WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserPasswordQuery:", error);
        throw error;
    }
}

export const getAllLeaveCounts = () =>{
    try {
        let query = `SELECT leave_type, leave_count FROM leaveTypeCounts`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllLeaveCounts:", error);
        throw error;
    }
}

export const insertUserLeaveCountQuery = (array)=>{
    try {
        let query = `INSERT INTO userLeaveCounts (emp_id, leave_type, leave_count) VALUES(?,?,?)`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const insertOtpQuery = (array) => {
    try {
        let query = `UPDATE users SET otp = ? WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const getOtpQuery = (array) => {
    try {
        let query = `SELECT otp FROM users WHERE email = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserLeaveCountQuery:", error);
        throw error;
    }
}

export const checkUserDataByUserIdQuery = (array)=> {
    try{
    let query = `SELECT * FROM users WHERE emp_id = ?`
    return pool.query(query, array);
    }
    catch (error) {
        console.error("Error executing checkUserDataByUserIdQuery:", error);
        throw error;
}
}

export const updateUserProfileQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserProfileQuery:", error);
        throw error;
    }
}

export const getUserDataByUserIdQuery = (array) =>{
    try {
        let query = `SELECT
                    users.*,
                    images.public_id
                FROM
                    users
                LEFT JOIN
                    images ON images.emp_id = users.emp_id
                WHERE
                    users.emp_id = ?;`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserDataByUserIdQuery:", error);
        throw error;
    }
}

export const updateUserProfilePictureQuery = async (array) => {
    try {
        let query = `UPDATE users SET profile_picture = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserProfilePictureQuery:", error);
        throw error;
    }
}

export const fetchAllEmployeeIdsQuery = async () => {
    try {
        let query = `SELECT emp_id, CONCAT(first_name, ' ', last_name) AS name FROM users`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchAllEmployeeIdsQuery:", error);
        throw error;
    }
}