import { validationResult } from "express-validator";
import { addPolicyQuery, deletePolicyQuery, fetchPolicyQuery, fetchPolicyIfExistsQuery } from "../models/policiesQuery.js";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse } from "../../../utils/response.js";
import dotenv from "dotenv";

dotenv.config();

export const addPolicy = async (req, res, next) => {
    try { 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array() ,"");
        }
        const file_data = req.file;
        const {policy_heads} = req.body;

        const [policy_exists] = await fetchPolicyIfExistsQuery();

        if (policy_exists.length > 0) {
            return errorResponse(res, '', "Policy File already exists, if you want to add new file, pls delete the existing one.");
        }

        let [data] = await addPolicyQuery([
            policy_heads,
            file_data.buffer
        ])
        return successResponse(res, data, "Policy added Successfully");
    }catch (error){
        return internalServerErrorResponse(res, error);
    } 
}

export const deletePolicy = async(req,res,next) =>  {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array() ,"");
        }
        const id = req.params.id;
        let [data] = await deletePolicyQuery([id]);

        if (data.affectedRows == 0) {
            return notFoundResponse(res, "", "Policy not found, wrong input.");
        }
        return successResponse(res, "", "Policy Deleted Successfully");
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }

} 

export const fetchPolicy = async(req , res , next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array(), "");
        }
        let [data] = await fetchPolicyQuery();
        return successResponse(res, data , "Policies fetched successfully");
    }catch(error){
        return internalServerErrorResponse(res, error);
    }

}