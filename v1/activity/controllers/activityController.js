import {successResponse, errorResponse, notFoundResponse, internalServerErrorResponse} from "../../../utils/response.js";
import { validationResult } from "express-validator";
import {addAnnouncementQuery, updateAnnouncementQuery, deleteActivityQuery} from "../../announcements/models/announcementQuery.js";
import dotenv from "dotenv";
import { addActivityQuery, getActivityByIdQuery, getLastActivityIdQuery, fetchActivityQuery } from "../query/activityQuery.js";
import { crossOriginResourcePolicy } from "helmet";
import {uploadImageToCloud, deleteImageFromCloud} from "../../helpers/cloudinary.js";
import { insertActivityImageQuery, deleteImageQuery, fetchImagesForActivityQuery, fetchImagesBasedOnIdForActivityQuery } from "../../images/imagesQuery.js";
dotenv.config();

export const addActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const files = req.files;
    const { event_type, priority, from_date, to_date, title, description} = req.body;
    const current_date = new Date();
    const check_from_date = new Date(from_date);
    const check_to_date = new Date(to_date);
    if(check_from_date.toISOString().split('T')[0] < current_date.toISOString().split('T')[0] ){
        return errorResponse(res, errors.array(), "From date should be greater than or equal to current date");
    }
    if(check_to_date < check_from_date){
        return errorResponse(res, errors.array(), "To date should be greater than or equal to the from date");
    }
    if(description.length >200){
        return errorResponse(res, errors.array(), "Description must be written in less than 200 characters");
    }
    if (event_type != "activity") {
      return notFoundResponse(res, "", "Event type not supported");
    }

    let [data] = await addActivityQuery([
      event_type,
      priority,
      from_date,
      to_date,
      title,
      description
    ]);
    
    const [last_id] = await getLastActivityIdQuery();

    for (let image of files){
      const imageBuffer = image.buffer;
      let uploaded_data = await uploadImageToCloud(imageBuffer);
      await insertActivityImageQuery([event_type, uploaded_data.secure_url, uploaded_data.public_id, last_id[0]._id, image.originalname])
    }

    return successResponse(res, data, "Activity added successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }

    const files = req.files;
    const req_data = req.body;
    const id = req.params.id;

    if((req_data.public_ids).length > 0){
      const public_ids = JSON.parse(req_data.public_ids);
         //delete image
      for (let public_id of public_ids){
          await deleteImageFromCloud(public_id);
          let [image_data] = await deleteImageQuery([public_id])
        }
    }
    delete req_data.public_ids;
    delete req_data.files;

    let updateQuery = "UPDATE announcements SET ";
    let updateValues = [];

    const condition = {
      _id: id,
    };

    Object.keys(req_data).forEach((key, index, array) => {
      updateQuery += `${key} = ?`;
      updateValues.push(req_data[key]);

      if (index < array.length - 1) {
        updateQuery += ", ";
      }
    });

    updateQuery += " WHERE ";

    Object.keys(condition).forEach((key, index, array) => {
      updateQuery += `${key} = ?`;
      updateValues.push(condition[key]);

      if (index < array.length - 1) {
        updateQuery += " AND ";
      }
    });

    let [data] = await updateAnnouncementQuery(updateQuery, updateValues);

    if (data.affectedRows == 0) {
      return notFoundResponse(res, "", "Activity not found, wrong input.");
    }

    //Upload new image
    for (let image of files){
      const imageBuffer = image.buffer;
      let uploaded_data = await uploadImageToCloud(imageBuffer);
      await insertActivityImageQuery(["activity", uploaded_data.secure_url, uploaded_data.public_id, id, image.originalname])
    }

    return successResponse(res, data, "Activity Updated Successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const getAllActivities = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    let event_type = "activity";
    let [data] = await fetchActivityQuery([event_type]);

    const activities = data.map(row => {
      const imageUrls = row.image_urls ? row.image_urls.split(',') : [];
      const originalFilenames = row.original_filenames ? row.original_filenames.split(',') : [];
      const publicIds = row.public_ids ? row.public_ids.split(',') : [];

      const images = imageUrls.map((image_url, index) => ({
          image_url,
          original_filename: originalFilenames[index],
          public_id: publicIds[index]
      }));

      return {
          activity_id: row._id,
          event_type: row.event_type,
          priority: row.priority,
          from_date: row.from_date,
          to_date: row.to_date,
          title: row.title,
          description: row.description,
          is_new: row.is_new,
          created_at: row.created_at,
          updated_at: row.updated_at,
          images
      };
  });
    return successResponse(res, activities, "Activiy Fetched Successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);;
  }
};

export const filterActivityByDate = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const date = req.body.date;
    let event_type = "activity";
    let array = await fetchActivityQuery([event_type]);
    const result = array[0].filter((item) => item.created_at.toISOString().includes(date));
    if (result.length === 0) {
      return notFoundResponse(res, result, "Activity not found in specified date");
    }
    return successResponse(res, result, "Activiy Fetched Successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);;
  }
};

export const deleteActivity = async(req,res,next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const id = req.params.id;
    let [data] = await deleteActivityQuery([id]);
    if (data.affectedRows == 0){
      return notFoundResponse(res, '', 'Activity not found, wrong input.');
    }

    let [array_of_ids] = await fetchImagesForActivityQuery([id])
    const public_ids = array_of_ids.map(item => item.public_id);
    for (let public_id of public_ids){
      await deleteImageFromCloud(public_id);
      let [image_data] = await deleteImageQuery([public_id])
    }

    return successResponse(res, '', 'Activity Deleted Successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);;
  }
};

export const getActivityById = async(req ,res , next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const { id } = req.params;
    const [data] = await getActivityByIdQuery([id]);
    if (data.length === 0){
      return notFoundResponse(res, '', 'Activity not found, wrong input.');
    }
    let [image_data] = await fetchImagesBasedOnIdForActivityQuery([id])
    data.push(image_data);
    return successResponse(res, data, "Activiy Fetched Successfully");
  }catch(error){
    return internalServerErrorResponse(res, error);;
  }
}