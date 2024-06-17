import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { insertAssetQuery, getLastAssetIdQuery, insertUserAssetDataQuery, fetchUserAssetsQuery, deleteAssetQuery, getAssetDataQuery, fetchAssetsQuery, updateAssetQuery } from "../models/assetQuery.js";
import {insertApprovalQuery} from "../../approvals/models/assetApprovalQuery.js";
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { insertAssetImageQuery, deleteImageQuery, fetchImagesForAssetQuery } from "../../images/imagesQuery.js";
import {uploadImageToCloud, deleteImageFromCloud} from "../../helpers/cloudinary.js";
dotenv.config();


export const createAsset = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let id = ''
        let [asset_data] = await getLastAssetIdQuery();

        if (asset_data.length == 0) {
            id = 'AMINV000'
        } else {
            id = asset_data[0].asset_id
        }
        const asset_id = await incrementId(id)
        let image_url;
        const file = req.file;
        const { asset_type, item, purchase_date, warranty_period, price, model_number, item_description } = req.body;

        if(file){
            const imageBuffer = file.buffer;
            let uploaded_data = await uploadImageToCloud(imageBuffer);
            await insertAssetImageQuery(["asset", uploaded_data.secure_url, uploaded_data.public_id, asset_id, file.originalname])
            image_url = uploaded_data.secure_url
        }

        await insertAssetQuery([
            asset_id,
            asset_type,
            item,
            purchase_date,
            warranty_period,
            price,
            model_number,
            item_description,
            image_url,
            new Date(),
            new Date(),
        ]);

        return successResponse(res, 'Asset successfully added');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateAsset = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;
        const file = req.file;

        if((req_data.public_id).length > 0){
            await deleteImageFromCloud(req_data.public_id);
            await deleteImageQuery([req_data.public_id])
        }
        delete req_data.public_id;
        delete req_data.file;

        let table = 'assets';

        const condition = {
            asset_id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateAssetQuery(query_values.updateQuery, query_values.updateValues)

        if(file){
            const imageBuffer = file.buffer;
            let uploaded_data = await uploadImageToCloud(imageBuffer);
            await insertAssetImageQuery(["asset", uploaded_data.secure_url, uploaded_data.public_id, id, file.originalname])
        }

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Asset not found, wrong input.');
        }
        return successResponse(res, data, 'Asset Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const assetRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { asset_type, emp_id, item, primary_purpose, requirement_type, request_type, details } = req.body;
        const current_date = new Date().toISOString().split('T')[0];

        await insertApprovalQuery([emp_id, request_type, item, current_date, primary_purpose, details ])
        const [data] = await insertUserAssetDataQuery([
            emp_id,
            asset_type,
            item,
            requirement_type,
            primary_purpose,
            details
        ]);
        return successResponse(res, data, 'Request sent successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchUserAssets = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {emp_id} = req.body;
        const [data] = await fetchUserAssetsQuery([emp_id])
        if(data.length == 0){
            return notFoundResponse(res, '', 'Data not found for this user.');
        }
        return successResponse(res, data, 'Asset data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchAssets = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchAssetsQuery()
        if(data.length == 0){
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Asset data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteAsset = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const asset_id = req.params.id;

        const [data] = await getAssetDataQuery([asset_id])
        if (data.length == 0) {
            return errorResponse(res, errors.array(), "Data not found")
        }else{
            let [array_of_ids] = await fetchImagesForAssetQuery([asset_id])
            const public_ids = array_of_ids.map(item => item.public_id);
            for (let public_id of public_ids){
              await deleteImageFromCloud(public_id);
              await deleteImageQuery([public_id])
            }
        
            await deleteAssetQuery([asset_id]);
            return successResponse(res, "", 'Asset Deleted Successfully');
        }
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}