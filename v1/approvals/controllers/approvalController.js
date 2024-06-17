import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, internalServerErrorResponse } from "../../../utils/response.js"
import {assetApprovalQuery, fetchAssetDataQuery, assetRejectionQuery, deleteAssetQuery} from "../models/assetApprovalQuery.js"
import {fetchTrainingDataQuery, trainingApprovalQuery, trainingRejectionQuery, deleteTrainingQuery} from "../models/trainingApprovalQuery.js"
import {leaveApprovalQuery, deleteLeaveQuery, leaveRejectionQuery, getUserLeaveDaysQuery, leaveTakenCountQuery} from "../models/leaveApprovalQuery.js"
dotenv.config();


export const approvalByAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const { emp_id, status, foreign_id, item, request_type } = req.body;
        const current_date = new Date().toISOString().split('T')[0];
        let message = "";

        const handleInventoryRequest = async () => {
            const [requestData] = await fetchAssetDataQuery([emp_id, item]);

            if (requestData.length === 0) {
                return notFoundResponse(res, '', 'Asset not found');
            }

            if (status === "approved") {
                await assetApprovalQuery([foreign_id, current_date, status, emp_id, item], [status, current_date, current_date, foreign_id, emp_id, item]);
                message = 'Asset approved successfully';
            } else if (status === "rejected") {
                await assetRejectionQuery([status, emp_id, item], [status, emp_id, item]);
                message = 'Asset rejected successfully';
            } else {
                await deleteAssetQuery([foreign_id, emp_id]);
            }
        };

        const handleTrainingRequest = async () => {
            const [requestData] = await fetchTrainingDataQuery([emp_id, foreign_id]);

            if (requestData.length === 0) {
                return notFoundResponse(res, '', 'Training not found');
            }

            if (status === "approved") {
                await trainingApprovalQuery([status, emp_id, foreign_id], [status, current_date, emp_id, foreign_id]);
                message = 'Training approved successfully';
            } else if (status === "rejected") {
                await trainingRejectionQuery([status, emp_id, foreign_id], [status, emp_id, foreign_id]);
                message = 'Training rejected successfully';
            } else {
                await deleteTrainingQuery([foreign_id, emp_id]);
            }
        };

        const handleLeaveRequest = async () => {
            let [userLeaveData] = await getUserLeaveDaysQuery([foreign_id])
            if(userLeaveData.length===0) {
                message = "Leave data not found."
            }else{
                let leave_taken_count = userLeaveData[0].days_count + 1;
            let leave_type = userLeaveData[0].leave_type
            let leave_type_count_by_admin = userLeaveData[0].leave_count

            if (status === "approved") {
                let [userLeaveTakenCount] = await leaveTakenCountQuery([emp_id, leave_type])
                if(leave_type_count_by_admin >= (userLeaveTakenCount[0].leave_taken_count + leave_taken_count)){
                    await leaveApprovalQuery([leave_taken_count, emp_id, leave_type], [status, current_date, emp_id, foreign_id], [status, foreign_id, leave_type]);
                    message = 'Leave approved successfully.';
                }else{
                    message = `User exceeded the leave count by ${(userLeaveTakenCount[0].leave_taken_count + leave_taken_count) - leave_type_count_by_admin}.`;
                }
            } else if (status === "rejected") {
                await leaveRejectionQuery([status, emp_id, foreign_id], [status, foreign_id, leave_type]);
                message = 'Leave rejected successfully.';
            } else if(status === "deleted"){
                await deleteLeaveQuery([emp_id, foreign_id], [foreign_id, leave_type]);
                message = 'Leave deleted successfully';
            }else{
                message = "Leave data not found."
            }
            }
        };

        if (request_type === "inventory") {
            await handleInventoryRequest();
        } else if (request_type === "training") {
            await handleTrainingRequest();
        }else if(request_type === "leave"){
            await handleLeaveRequest();
        }

        return successResponse(res, "", message);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};