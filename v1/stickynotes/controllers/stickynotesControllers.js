import { validationResult } from "express-validator";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse } from "../../../utils/response.js";
import {  addStickyNotesQuery, deleteStickyNotesQuery, getStickyNotesByIdQuery } from "../models/stickynotesQuery.js";

export const addStickyNotes = async (req, res) => {
  try {
    // const { note } = req.body;
    
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "")
    }
    const { note, emp_id } = req.body;
    // Insert note into the database
    const [result] = await addStickyNotesQuery([note, emp_id])
    return successResponse(res,result,"Note stored successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const getStickyNotes = async (req, res, next) => {
  // Retrieve all notes from the database
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "")
    }
    const  emp_id  = req.params.emp_id;
    let [result] = await getStickyNotesByIdQuery([emp_id]);
    return successResponse(res,result);;
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const deleteStickyNotes = async (req, res, next) => {
  
  // Log request body and _id type
  try {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "")
    }
    // Verify if _id is a valid string
    const _id = req.params.id;
    const emp_id = req.params.emp_id;
    let [result] = await deleteStickyNotesQuery([_id , emp_id]);
     // Log query result

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      return notFoundResponse(res, "", "stickynotes not found, wrong input.");
      }
      return successResponse(res, "", "note Deleted Successfully");
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};
