import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteSkillSetQuery, getAllSkillSetQuery, insertSkillSetQuery, updateSkillSetQuery, checkSameSkillQuery, getSkillsQuery } from "../models/query.js";
dotenv.config();


export const createSkillSet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {skill} = req.body;
        const [exist_skill] = await checkSameSkillQuery([skill])

        if (exist_skill.length > 0){
            return errorResponse(res, '', 'Sorry, Skill already exists.');
        }

        const [data] = await insertSkillSetQuery([skill]);
        return successResponse(res,{skill_id: data.insertId}, 'skill created successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateSkillSet = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const skill_id = req.params.id;
        let table = 'skillSets';

        const condition = {
            _id: skill_id,
        };
        const req_data = req.body; 
        const [exist_skill_id] = await getSkillsQuery([skill_id])

        if (exist_skill_id.length == 0) {
            return errorResponse(res, '', 'Sorry, Skill not found.');
        }
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateSkillSetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, data, 'Skill updated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchSkillSets = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllSkillSetQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Skills fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteSkillSet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const skill_id = req.params.id
        const [exist_skill_id] = await getSkillsQuery([skill_id])

        if (exist_skill_id.length == 0) {
            return errorResponse(res, '', 'Sorry, Skill not found.');
        }
        await deleteSkillSetQuery([skill_id]);
        return successResponse(res, 'Skill deleted successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};