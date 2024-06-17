import pool from "../../../config/db.js"

export const insertTeamQuery = async (array) => {
    try {
        let query = `INSERT INTO teams (team) VALUES (?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertTeamQuery:", error);
        throw error;
    }
}

export const updateTeamWorksheetQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateTeamWorksheetQuery:", error);
        throw error;
    }
}

export const getAllTeamQuery = async () => {
    try {
        let query = `SELECT _id, team FROM teams`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllTeamQuery:", error);
        throw error;
    }
}

export const deleteTeamQuery = async (array) => {
    try {
        let query = `DELETE FROM teams WHERE _id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteTeamQuery:", error);
        throw error;
    }
}

export const getTeamQuery = async (array) => {
    try {
        let query = `SELECT * FROM teams WHERE _id = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getTeamQuery:", error);
        throw error;
    }
}

export const checkSameTeamNameQuery = async (array) => {
    try {
        let query = `SELECT * FROM teams WHERE team = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing checkSameTeamNameQuery:", error);
        throw error;
    }
}