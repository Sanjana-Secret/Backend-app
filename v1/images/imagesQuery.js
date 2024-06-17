import pool from "../../config/db.js";

export const insertActivityImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        activity_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the insertActivityImageQuery:" , err);
        throw(err);
    }
}

export const deleteImageQuery = (array)=> {
    try{
    let query = `DELETE FROM images WHERE public_id = ?`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the deleteImageFromDatabase:" , err);
        throw(err);
    }
}

export const fetchImagesForActivityQuery = (array)=> {
    try{
    let query = `SELECT public_id FROM images WHERE activity_id = ?`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the fetchImagesForActivity:" , err);
        throw(err);
    }
}

export const fetchImagesBasedOnIdForActivityQuery = (array)=> {
    try{
    let query = `SELECT public_id, image_url, original_filename FROM images WHERE activity_id = ? AND type = 'activity'`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the fetchImagesBasedOnId:" , err);
        throw(err);
    }
}

export const insertEmpImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        emp_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the insertEmpImageQuery:" , err);
        throw(err);
    }
}

export const insertAssetImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        asset_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the insertAssetImageQuery:" , err);
        throw(err);
    }
}

export const fetchImagesForAssetQuery = (array)=> {
    try{
    let query = `SELECT public_id FROM images WHERE asset_id = ?`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the fetchImagesForAssetQuery:" , err);
        throw(err);
    }
}

export const fetchImagesForDashboardQuery = ()=> {
    try{
    let query = `SELECT public_id, image_url, original_filename FROM images WHERE type = 'dashboard'`
    return pool.query(query);}
    catch(err){
        console.log("Error in executing in the fetchImagesForDashboardQuery:" , err);
        throw(err);
    }
}