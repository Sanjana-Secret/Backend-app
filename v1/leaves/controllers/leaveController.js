import dotenv from "dotenv"
import {
    createHoliday, updateHolidayQuery, createLeaveType, checkSameHolidayQuery,
    createLeaveCount, updateLeaveQuery, fetchLeavesCountQuery, checkSameLeaveTypeNameQuery, deleteLeaveTypeQuery, getLeavesTypesQuery, insertUserLeaveDataQuery, insertApprovalForLeaveQuery, getLastLeaveId, getLeaveTypeCountByAdmin,
    getAllUsersLeaveCountQuery, getUserLeaveDataQuery, fetchLeaveTakenOverviewQuery, deleteLeaveTypeAndCountQuery, fetchHolidayListQuery, getHolidayDataQuery, deleteHolidayQuery,
    getallUserLeaveDataQuery
} from "../../leaves/models/leaveQuery.js"
import { leaveTakenCountQuery } from "../../approvals/models/leaveApprovalQuery.js"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { validationResult } from "express-validator";
dotenv.config();

export const addHoliday = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { date, holiday } = req.body;

        const [exist_holiday] = await checkSameHolidayQuery([date])
        if (exist_holiday.length > 0) {
            return errorResponse(res, '', 'Sorry, Holiday already exists.');
        }
        await createHoliday([date, holiday]);
        return successResponse(res, '', `Holiday added successfully.`);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateHoliday = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let table = 'holidays';

        const condition = {
            _id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateHolidayQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0) {
            return notFoundResponse(res, '', 'Holiday not found, wrong input.');
        }
        return successResponse(res, data, 'Holiday Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchHolidayList = async (req,res,next) => {
    try {
        const [data] = await fetchHolidayListQuery();
        if (data.length == 0) {
            return notFoundResponse(res, "", "Data not found");
        }
        return successResponse(res, data, 'Holiday List fetched successfully');
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteHoliday = async(req,res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id

        const [data] = await getHolidayDataQuery([id]);
        if (data.length == 0) {
            return notFoundResponse(res, "", "Data not found");
        }else{
            await deleteHolidayQuery([id]);
            return successResponse(res, "", 'Data Deleted Successfully');
        }
    }catch(error){
        return internalServerErrorResponse(res, error);
    }
}

export const addLeaveTypeAndCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const { leave_type, description, leave_count, gender } = req.body;

        // Check if leave type already exists
        const [existingLeaveTypes] = await checkSameLeaveTypeNameQuery([leave_type]);
        console.log(existingLeaveTypes);
        if (existingLeaveTypes.length > 0) {
            return errorResponse(res, '', 'Sorry, Leave Type already exists.');
        }

        // Create leave type
        const [data]= await createLeaveType([leave_type, description]);
        const leave_type_id = data.insertId;
        // Create leave count
        await createLeaveCount([leave_type_id, leave_type, leave_count, gender]);

        return successResponse(res, '', `Leave type and count added successfully.`);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateLeaveTypeAndCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;
        const leave_type_id = req.params.leave_type_id;
        let table = 'leaveTypeCounts';

        const condition = {
            _id: id,
            leave_type_id:leave_type_id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateLeaveQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0) {
            return notFoundResponse(res, '', 'Data not found, wrong input.');
        }
        return successResponse(res, data, 'Data Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteLeaveTypeAndCount  = async (req, res,next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const leave_type_id = req.params.leave_type_id;
        const [data] = await getLeavesTypesQuery([leave_type_id]);
        if (data.length == 0) {
            return notFoundResponse(res, "", "Data not found");
        }
        await Promise.all([
        await deleteLeaveTypeAndCountQuery([id, leave_type_id]),
        await deleteLeaveTypeQuery([leave_type_id])
    ])
        
        return successResponse(res, "",'Data deleted Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchLeaveTypesAndTheirCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchLeavesCountQuery()
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchLeaveTakenOverview = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let {emp_id, status, from_date} = req.body;
        status = status || "approved";
        const [data] = await fetchLeaveTakenOverviewQuery([emp_id, status], from_date)
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const leaveRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { leave_type, emp_id, subject, body, from_date, to_date } = req.body;
        const current_date = new Date().toISOString().split('T')[0];
        let from = new Date(from_date);
        let to = new Date(to_date);

        // Calculate the difference in milliseconds
        let diffInMs = Math.abs(to - from);

        // Convert the difference to days
        let daysCount = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        let total_days = daysCount + 1
        let [userLeaveTakenCount] = await leaveTakenCountQuery([emp_id, leave_type])
        let [leaveTypeCountByAdmin] = await getLeaveTypeCountByAdmin([leave_type])
        let message = ""
        if(leaveTypeCountByAdmin.length==0){
            message = "Please select valid leave type."
            return notFoundResponse(res, "", message);
        }
        if(leaveTypeCountByAdmin[0].leave_count>=(total_days+userLeaveTakenCount[0].leave_taken_count)){
            await insertUserLeaveDataQuery([
                emp_id, 
                leave_type,
                from_date,
                to_date,
                subject,
                body
            ]);
            const [foreign_id] = await getLastLeaveId()
            await insertApprovalForLeaveQuery([emp_id, foreign_id[0]._id, "leave", leave_type, current_date, from_date, to_date, subject, body])
            message = 'Request sent successfully'
        }else{
            message = `User exceeded the leave count by ${(total_days+userLeaveTakenCount[0].leave_taken_count)-leaveTypeCountByAdmin[0].leave_count}`
        }

        return successResponse(res, "", message);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserLeaveDataForDashboard =async (req, res, next) => {
    try {
        const emp_id = req.params.id
        const [user_data] = await getAllUsersLeaveCountQuery([emp_id]);
        const [holiday_list_data] = await fetchHolidayListQuery();
        if (user_data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, {user_data, holiday_list_data}, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserLeaveData = async (req, res, next) => {
    try {
        const {emp_id} = req.body;
        const [data] = await getUserLeaveDataQuery([emp_id]);
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}
export const getUserAllLeaveData = async (req, res, next) => {
    try {
        const {emp_id} = req.body;
        const [data] = await getallUserLeaveDataQuery([emp_id]);
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}