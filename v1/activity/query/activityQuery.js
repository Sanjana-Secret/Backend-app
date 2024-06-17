import pool from "../../../config/db.js"

export const addActivityQuery = (array)=> {
    try{
    let query = `INSERT INTO announcements (
        event_type,
        priority,
        from_date, 
        to_date, 
        title, 
        description
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the addActivityQuery:" , err);
        throw(err);
    }
}
export const getActivityByIdQuery = (array) => {
    try{
        let query = `SELECT *
        FROM announcements
        WHERE event_type = 'activity' AND _id = ?;`;
        return pool.query(query, array);
    }catch(err){
        console.log("Error in executing in the getActivityByIdQuery:" , err);
        throw(err);
    }
}

export const getLastActivityIdQuery = () =>{
    let query = `SELECT _id FROM announcements ORDER BY _id DESC LIMIT 1`
    return pool.query(query);
}

export const fetchActivityQuery = (array) => {
    let query = `SELECT
                    announcements._id,
                    announcements.event_type,
                    announcements.priority,
                    announcements.from_date,
                    announcements.to_date,
                    announcements.title,
                    announcements.description,
                    announcements.is_new,
                    announcements.created_at,
                    announcements.updated_at,
                    GROUP_CONCAT(images.image_url) AS image_urls,
                    GROUP_CONCAT(images.public_id) AS public_ids,
                    GROUP_CONCAT(images.original_filename) AS original_filenames
                FROM
                    announcements
                LEFT JOIN
                    images ON images.activity_id = announcements._id AND images.type = 'activity'
                WHERE
                    announcements.event_type = ?
                GROUP BY
                    announcements._id,
                    announcements.event_type,
                    announcements.priority,
                    announcements.from_date,
                    announcements.to_date,
                    announcements.title,
                    announcements.description,
                    announcements.is_new,
                    announcements.created_at,
                    announcements.updated_at;
`;
    return pool.query(query, array);
};
  