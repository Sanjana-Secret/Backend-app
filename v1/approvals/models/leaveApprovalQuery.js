import pool from "../../../config/db.js"

export const leaveApprovalQuery = async (array1, array2, array3) => {
    const query1 = `UPDATE userLeaveCounts
    SET leave_taken_count = leave_taken_count + ?
    WHERE emp_id = ? AND leave_type = ?;`;

    const query2 = `UPDATE approvals
    SET
        status = ?,
        approval_date = ?
    WHERE
        emp_id = ? AND
        foreign_id = ?;`;
    const query3 = `UPDATE leaveDatesAndReasons
    SET 
        status = ?
    WHERE
        _id = ? AND
        leave_type = ?;`;

    try {
        await pool.query(query1, array1);
        await pool.query(query2, array2);
        await pool.query(query3, array3);
    } catch (error) {
        console.error("Error executing leaveApprovalQuery:", error);
        // Handle the error appropriately
        throw error;
    }
};


export const getUserLeaveDaysQuery = async (array) => {
    try {
        const query = `SELECT 
        DATEDIFF(issued_till, issued_from) AS days_count, 
        item AS leave_type,
        (SELECT leave_count FROM leaveTypeCounts WHERE leaveTypeCounts.leave_type = approvals.item) AS leave_count
    FROM 
        approvals 
    WHERE 
        foreign_id = ?;
    `;

        const result = await pool.query(query, array);
        console.log("Result from getUserLeaveDaysQuery:", result);

        return result;

    } catch (error) {
        console.error("Error executing getUserLeaveDaysQuery:", error);
        // Handle the error appropriately
        throw error;
    }
};

export const leaveTakenCountQuery = async (array) =>{

    let query = `SELECT leave_taken_count FROM userLeaveCounts WHERE emp_id = ? AND leave_type = ?;`
    try {
        const result = await pool.query(query, array);
        console.log("Result from leaveTakenCountQuery:", result);
        return result
    } catch (error) {
        console.error("Error executing leaveTakenCountQuery:", error);
        throw error;
    }
}

export const leaveRejectionQuery = async (array1, array2) => {
    const query1 = `UPDATE approvals
    SET
        status = ?
    WHERE
        emp_id = ? AND
        foreign_id = ?;`;
    const query2 = `UPDATE leaveDatesAndReasons
    SET 
        status = ?
    WHERE
        _id = ? AND
        leave_type = ?;`;
    try {
        await pool.query(query1, array1);
        await pool.query(query2, array2);
    } catch (error) {
        console.error("Error executing leaveRejectionQuery:", error);
        // Handle the error appropriately
        throw error;
    }
}
export const deleteLeaveQuery = async (array1, array2) => {
    const deleteQuery1 = `DELETE FROM approvals
    WHERE 
        emp_id = ? AND 
        foreign_id = ?;`;

    const deleteQuery2 = `DELETE FROM leaveDatesAndReasons
    WHERE 
        _id = ? AND 
        leave_type = ?;`;
    try {
        await pool.query(deleteQuery1, array1);
        await pool.query(deleteQuery2, array2);
    } catch (error) {
        console.error("Error executing deleteLeaveQuery:", error);
        // Handle the error appropriately
        throw error;
    }
}