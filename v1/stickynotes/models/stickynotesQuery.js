import pool from "../../../config/db.js";
export const addStickyNotesQuery = (array) => {
    try{
        let query = `INSERT INTO temporaryNotes (note , emp_id) VALUES (? , ?);`;
        return  pool.query(
            query,
            array
          );
    }catch(err){
        console.log("Error in executing in the addStickyNotesQuery:" , err);
        throw err;
    }
}

export const getStickyNotesByIdQuery = (array) => {
    try {
        let sql = `SELECT * FROM temporaryNotes WHERE emp_id = ?`
        return pool.query(sql , array);
    }catch(err){
        console.log("Error in executing in the getStickyNotesByIdQuery:" , err);
        throw err;
    }
}
export const deleteStickyNotesQuery = (array) => {
    try{
        const sql = "DELETE FROM temporaryNotes WHERE _id = ? AND emp_id = ?";
        return pool.query(sql, array);
    }catch(err){
        console.log("Error in executing in the deleteStickyNotesQuery:" , err);
        throw err;
    }
    
}