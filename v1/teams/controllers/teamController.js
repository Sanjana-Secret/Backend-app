import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteTeamQuery, getAllTeamQuery, insertTeamQuery, updateTeamWorksheetQuery, checkSameTeamNameQuery, getTeamQuery } from "../models/query.js";
dotenv.config();

export const createTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {team} = req.body;

        let [exist_team_name] = await checkSameTeamNameQuery([team])
        if (exist_team_name.length > 0){
            return errorResponse(res, '', 'Sorry, Team with this name already exists.');
        }
        const [data] = await insertTeamQuery([team]);
        return successResponse(res,{team_id: data.insertId}, 'Team created successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateTeam = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        let table = 'teams';
        const condition = {
            _id: id
        };
        const req_data = req.body;

        let [exist_id] = await getTeamQuery([id])

        if (exist_id.length > 0) {
            let query_values = await createDynamicUpdateQuery(table, condition, req_data)
            let [data] = await updateTeamWorksheetQuery(query_values.updateQuery, query_values.updateValues);
            return successResponse(res, data, 'Team updated successfully.');
        }else{
            return notFoundResponse(res, '', 'Team not found.');
        }
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchTeams = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllTeamQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Teams fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const team_id = req.params.id

        let [exist_id] = await getTeamQuery([team_id])
        if (exist_id.length == 0){
            return errorResponse(res, '', 'Team not found');
        }
        await deleteTeamQuery([team_id]);
        return successResponse(res, 'Team deleted successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};