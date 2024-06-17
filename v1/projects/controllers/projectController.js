import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteProjectQuery, getAllProjectQuery, insertProjectQuery, updateProjectWorksheetQuery, checkProjectIdAndCategoryIdQuery } from "../models/query.js";
dotenv.config();

export const createProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {project, category_id, client_name, project_status, project_lead,project_manager,  start_month, end_month} = req.body;
        const [data]= await insertProjectQuery([project, category_id, client_name, project_status,project_manager, project_lead,  start_month, end_month]);
        return successResponse(res,{project_id: data.insertId}, 'Project created successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateProject = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const category_id = req.params.category_id;
        let table = 'projects';

        const condition = {
            _id: id,
            category_id: category_id
        };
        const req_data = req.body;

        const [check_ids] = await checkProjectIdAndCategoryIdQuery([id, category_id])

        if (check_ids.length == 0) {
            return errorResponse(res, "" ,"No project found. Pls recheck the ids.")
        }
        
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateProjectWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'Project updated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchProjects = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllProjectQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Projects fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const projecy_id = req.params.id;
        const category_id = req.params.category_id;

        const [check_ids] = await checkProjectIdAndCategoryIdQuery([projecy_id, category_id])

        if (check_ids.length == 0) {
            return errorResponse(res, "" ,"No project found. Pls recheck the ids.")
        }
        
        await deleteProjectQuery([projecy_id, category_id]);
        return successResponse(res, 'project deleted successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};