import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { insertTrainingDataQuery, getLastTrainingIdQuery, addUserTrainingInfoQuery, getTrainingDataQuery, displayDataForTrainingCardsQuery, displayTrainingsForUserQuery, deleteUserTrainingDataQuery, 
    getUserDataForTrainingQuery, deleteTrainingDataQuery, updateTrainingQuery, checkSameTrainingQuery, checkExistingUserTrainingDataQuery, displayAllUsersTrainingDataQuery } from "../models/trainingQuery.js";
import {incrementId, createDynamicUpdateQuery} from "../../helpers/functions.js"
import {insertApprovalForTrainingQuery} from "../../approvals/models/trainingApprovalQuery.js"
dotenv.config();

export const addNewTraining = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let id = ''
        let [training_data] = await getLastTrainingIdQuery();

        if (training_data.length == 0) {
            id = 'AMTRAN000'
        }else{
            id = training_data[0].training_id
        }
        const training_id = await incrementId(id)
        const {course_name, course_description, roadmap_url, details} = req.body;

        const [exist_training] = await checkSameTrainingQuery([course_name])
        if (exist_training.length > 0){
            return errorResponse(res, '', 'Sorry, Training with this name already exists.');
        }
     
        await insertTrainingDataQuery([
            training_id,
            course_name,
            course_description,
            roadmap_url,
            details
        ]);
        return successResponse(res, '', 'Training successfully added');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const requestUserTraining = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let { emp_id, training_id, progress_status, request_type} = req.body;
        let [training_data] = await getTrainingDataQuery([training_id])
        let [existing_training_data] = await checkExistingUserTrainingDataQuery([emp_id, training_id])
        const current_date = new Date().toISOString().split('T')[0];

        if(training_data.length == 0 ) {
           return errorResponse(res, '', "Training Id provided is not correct")
        }else if (existing_training_data.length > 0){
            return errorResponse(res, '', `Current training is already registered with the given employee's id.`);
        }else{
            const course_name = training_data[0].course_name;
            const course_description = training_data[0].course_description;
            const details = training_data[0].details;
            const roadmap_url = training_data[0].roadmap_url;

            await insertApprovalForTrainingQuery([emp_id, training_id, request_type, course_name, current_date, course_description, details ])
            await addUserTrainingInfoQuery([
                emp_id,
                training_id,
                course_name,
                course_description,
                details,
                roadmap_url,
                progress_status
            ]);
            return successResponse(res, '', 'Training successfully added');
        }
        
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const trainingCardsData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const [data] = await displayDataForTrainingCardsQuery([])

        if(data.length == 0) {
            return errorResponse(res, errors.array(), "No Trainings in Database.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const getUserTrainingData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const  {emp_id} = req.body;
        let [data] = await displayTrainingsForUserQuery([emp_id])

        if(data.length == 0) {
            return errorResponse(res, errors.array(), "User has not registered in any trainings or the given employee id is wrong.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateTrainingData = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let table = 'trainings';

        const condition = {
            training_id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateTrainingQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Training not found, wrong input.');
        }
        return successResponse(res, data, 'Training Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteTrainingData = async (req, res, next) =>{
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        let [data] = await getTrainingDataQuery([id]);

        if (data.length == 0) {
            return errorResponse(res, errors.array(), "Data not found")
        }else{
            await deleteTrainingDataQuery([id]);
            return successResponse(res, "", 'Data Deleted Successfully');
        }

    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const getEveryUserTrainingData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let [data] = await displayAllUsersTrainingDataQuery()

        if(data.length == 0) {
            return errorResponse(res, "" ,"No trainings alloted till now.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};