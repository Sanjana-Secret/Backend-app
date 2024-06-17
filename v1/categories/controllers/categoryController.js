import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { createDynamicUpdateQuery } from "../../helpers/functions.js";
import { deleteCategoryQuery, getAllCategoryQuery, insertCategoryQuery, updateCategoryWorksheetQuery, checkSameCategoryQuery, getCategoryQuery } from "../models/query.js";
import { validationResult } from "express-validator";



export const createCategoryForWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {category, points} = req.body;
        const [exist_category] = await checkSameCategoryQuery([category])

        if (exist_category.length > 0){
            return errorResponse(res, '', 'Sorry, Category already exists.');
        }

        const [data] = await insertCategoryQuery([category, points]);
        return successResponse(res,{category_id: data.insertId}, 'category created successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateCategoryForWorksheet = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const category_id = req.params.id;
        let table = 'categories';

        const condition = {
            _id: category_id
        };

        const req_data = req.body;
        const [exist_category_id] = await getCategoryQuery([category_id])

        if (exist_category_id.length == 0) {
            return errorResponse(res, '', 'Sorry, Category not found.');
        }
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateCategoryWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, data, 'Category updated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchCategoryForWorkSheet = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllCategoryQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Categories fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteCategoryForWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const category_id = req.params.id
        const [exist_category_id] = await getCategoryQuery([category_id])

        if (exist_category_id.length == 0) {
            return errorResponse(res, '', 'Sorry, Category not found.');
        }
        await deleteCategoryQuery([category_id]);
        return successResponse(res, 'category deleted successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};