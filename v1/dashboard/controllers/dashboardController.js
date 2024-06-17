import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { internalServerErrorResponse, successResponse } from "../../../utils/response.js";
import { getMonthlyProjectCountQuery, getUserCountOnClientProjectQuery, getTotalProjectsQuery, getProjectCountBasedOnTeamQuery, 
    getEmployeeTeamCountQuery, fetchAllProjectsDataQuery, fetchApprovalDataQuery} from "../query/dashboardQuery.js";
import {fetchActivityORAnnouncementQuery} from "../../users/models/userDashboardQuery.js"; 
dotenv.config();

export const adminDashboard = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const [
            [live_projects_data],
            [employee_count_with_team],
            [total_projects],
            [employee_count_with_client],
            [get_employee_team_count],
            [project_details]
        ] = await Promise.all([
            getMonthlyProjectCountQuery(),
            getProjectCountBasedOnTeamQuery(),
            getTotalProjectsQuery(),
            getUserCountOnClientProjectQuery(),
            getEmployeeTeamCountQuery(),
            fetchAllProjectsDataQuery()
        ]);

        employee_count_with_team.push(total_projects[0])
        employee_count_with_team.push(employee_count_with_client[0])

        const data = {
            live_projects_data: live_projects_data,
            employee_count_with_team: employee_count_with_team,
            get_employee_team_count: get_employee_team_count,
            project_details: project_details
        }
        return successResponse(res, data, 'Employee Count Fetched Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchApprovalData = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

       const [approval_data] = await fetchApprovalDataQuery();

        return successResponse(res, approval_data, "Approvals data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const fetchActivityAndAnnouncementData = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const[
        [activity_data],
        [announcement_data]] = await Promise.all([ fetchActivityORAnnouncementQuery(["activity"]),fetchActivityORAnnouncementQuery(["announcement"])])

        const data = {
            activity_data: activity_data,
            announcement_data: announcement_data
        }

        return successResponse(res, data, "Acitvites and Announcements fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};