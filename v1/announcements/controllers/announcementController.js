import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { addAnnouncementQuery, fetchAnnouncementsQuery, deleteAnnouncementQuery, updateAnnouncementQuery, fetchActivityQuery} from "../models/announcementQuery.js";
dotenv.config();


export const createAnnouncement = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {event_type,
            priority,
            from_date, 
            to_date, 
            title, 
            description} = req.body;

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
        if(event_type != "announcement"){
            return notFoundResponse(res, '', 'Event type not supported');
        }

        let [data] = await addAnnouncementQuery([
            event_type,
            priority,
            from_date, 
            to_date, 
            title, 
            description
        ])
        return successResponse(res, data, 'Announcement added successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
    
        let [data] = await fetchAnnouncementsQuery()
        return successResponse(res, data, 'Announcements Fetched Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const id = req.params.id;
    
        let [data] = await deleteAnnouncementQuery([id])

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Announcement not found, wrong input.');
        }
        return successResponse(res, '', 'Announcements Deleted Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateAnnouncements = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let updateQuery = 'UPDATE announcements SET ';
        let updateValues = [];

        const condition = {
            _id: id
        };

        Object.keys(req_data).forEach((key, index, array) => {
        updateQuery += `${key} = ?`;
        updateValues.push(req_data[key]);

        if (index < array.length - 1) {
            updateQuery += ', ';
        }
        });

        updateQuery += ' WHERE ';

        Object.keys(condition).forEach((key, index, array) => {
        updateQuery += `${key} = ?`;
        updateValues.push(condition[key]);

        if (index < array.length - 1) {
            updateQuery += ' AND ';
        }
        });

        let [data] = await updateAnnouncementQuery(updateQuery, updateValues)

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Announcement not found, wrong input.');
        }
        return successResponse(res, data, 'Announcement Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const filterAnnouncementByDate = async (req, res, next) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "");
      }
      const date = req.params.date;
      let event_type = "announcement";
      let array = await fetchActivityQuery([event_type]);
      const result = array[0].filter((item) => item.created_at.toISOString().includes(date));
      if (result.length === 0) {
        return notFoundResponse(res, result, "Announcement not found in specified date");
      }
      return successResponse(res, result, "Announcement Fetched Successfully");
    } catch (error) {
      return internalServerErrorResponse(res, error);;
    }
  };