import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { insertUserProjectQuery,getUserProjectQuery,userUpdateProjectQuery,checkProjectIdQuery, getUserProjectTimelineQuery} from "../models/userProjectQuery.js";
dotenv.config();


export const createUserProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager} = req.body;

        await insertUserProjectQuery([ project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager]);
        return successResponse(res, 'success', 'User Project created successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const fetchUserProjects = async(req, res, next) =>{
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.emp_id;
        const [user] = await getUserProjectQuery([emp_id]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User project not found');
        }
        return successResponse(res, user, 'User project data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const userUpdateProject = async(req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.emp_id;
        const project_id = req.params.project_id;
        let table = 'userProjects';
        const condition = {
            emp_id: id,
            project_id:project_id
        };
        const req_data = req.body;

        let [exist_id] = await checkProjectIdQuery([id])

        if (exist_id.length > 0) {
            let query_values = await createDynamicUpdateQuery(table, condition, req_data)
            let [data] = await userUpdateProjectQuery(query_values.updateQuery, query_values.updateValues);
            return successResponse(res, data, 'User project updated successfully.');
        }else{
            return notFoundResponse(res, '', 'User project not found.');
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);
    }
}

export const getUserProjectTimeline = async(req, res, next)=> {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.emp_id;
        const [user] = await getUserProjectTimelineQuery([emp_id]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User project not found');
        }
        return successResponse(res, user, 'User project data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }

}