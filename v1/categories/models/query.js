import pool from "../../../config/db.js"

export const insertCategoryQuery = async (array) => {
    try {
        let query = `INSERT INTO categories (category, points) VALUES (?, ?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertCategoryQuery:", error);
        throw error;
    }
}

export const updateCategoryWorksheetQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateCategoryWorksheetQuery:", error);
        throw error;
    }
};

export const getAllCategoryQuery = async (array) => {
    try {
        let query = `SELECT _id, category, points FROM categories`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllCategoryQuery:", error);
        throw error;
    }
}

export const getCategoryQuery = async (array) => {
    try {
        let query = `SELECT * FROM categories WHERE _id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getCategoryQuery:", error);
        throw error;
    }
}

export const deleteCategoryQuery = async (array) => {
    try {
        let query = `DELETE FROM categories WHERE _id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteCategoryQuery:", error);
        throw error;
    }
}

export const checkSameCategoryQuery = async (array) => {
    try {
        let query = `SELECT * FROM categories WHERE category = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing checkSameCategoryQuery:", error);
        throw error;
    }
}