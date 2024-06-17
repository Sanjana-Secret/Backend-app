import pool from "../../../config/db.js";

export const addPolicyQuery = (array) => {
    try {
        let query = `INSERT into policies (
            policy_heads,
            file_data
        ) VALUES (?,?);`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserPointsQuery:", error);
        throw error;
    }
}

export const deletePolicyQuery = (array) => {
    let query = `DELETE from policies WHERE _id = ?;
    `;
    return pool.query(query,array);
}

export const fetchPolicyQuery = () => {
    let query = ` SELECT _id, policy_heads, file_data FROM policies;`;
    return pool.query(query);
}

export const fetchPolicyIfExistsQuery = () => {
    let query = ` SELECT * FROM policies;`;
    return pool.query(query);
}