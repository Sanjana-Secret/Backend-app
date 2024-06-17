import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { insertUserWorksheetQuery, updateUserWorksheetQuery, deleteUserWorksheetQuery, fetchUserWorksheetQuery } from "../models/query.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import pool from "../../../config/db.js"
dotenv.config();

export const createUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { emp_id, team_id, project_id, category_id, skill_set_id, description, date } = req.body;  // date format should be YYYY-MM-DD

        const current_date = new Date();
        const seven_days_ago = new Date(); // Initialize a new date object
        seven_days_ago.setDate(current_date.getDate() - 7);
        const check_date = new Date(date);
        if(check_date.toISOString().split('T')[0] < seven_days_ago.toISOString().split('T')[0] ){
            return notFoundResponse(res, '', "Date should be greater than or equal to last seven days");
        }

        if(description.length >200){
            return notFoundResponse(res, '', "Description must be written in less than 200 characters");
        }
        const [data] = await insertUserWorksheetQuery([emp_id, team_id,project_id, category_id, skill_set_id, description, date]);
        return successResponse(res,{_id: data.insertId}, 'Worksheet filled successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const user_worksheet_id = req.params.id;
        const emp_id = req.params.emp_id;
        let table = 'worksheets';

        const condition = {
            _id: user_worksheet_id,
            emp_id: emp_id
        };
        const req_data = req.body;
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateUserWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'worksheet updated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const worksheet_id = req.params.id
        const emp_id = req.params.emp_id;
        await deleteUserWorksheetQuery([worksheet_id, emp_id]);
        return successResponse(res, 'worksheet deleted successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const fetchUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.emp_id
        const [worksheets] = await fetchUserWorksheetQuery([emp_id]);
        for (let worksheet of worksheets) {
            const skill_ids = worksheet.skill_set_id.split(',').map(id => id.trim());
            if (skill_ids.length > 0) {
                const placeholders = skill_ids.map((data) => data).join(',');
                const [skills] = await pool.query(
                `SELECT skill FROM skillSets WHERE _id IN (${placeholders})`,
                skill_ids
            );
                worksheet.skills = skills.map(skill => skill.skill);
            } else {
                worksheet.skills = [];
            }
        }
        if (worksheets.length == 0) {
            return notFoundResponse(res, '', 'worksheets not found.');
        }
        return successResponse(res, worksheets, 'worksheet fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}