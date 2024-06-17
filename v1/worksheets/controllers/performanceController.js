import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { getCategoryTotalPointsQuery, getTeamPointsQuery, fetchTeamCountQuery, 
    fetchTeamNameQuery,} from "../models/performanceQuery.js"
import { getWorkingDaysCountPreviousMonth } from "../../helpers/functions.js"
dotenv.config();

export const calculatePerformanceForTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth();

        const [
            [category_points_can_be_earned_per_day],
            [month_data],
            [total_team_count]
        ] = await Promise.all([
            getCategoryTotalPointsQuery(),
            getTeamPointsQuery(),
            fetchTeamCountQuery()
        ]);

        const category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month;

        const team_performance = await Promise.all(total_team_count.map(async team => {
            const team_id = team.team_id;
            const matching_team = month_data.find(item => item._id === team_id);

            if (matching_team) {
                const [team_name_obj] = await fetchTeamNameQuery([team_id]);
                const total_points = category_points_can_be_earned_per_month * team.total_users;
                const team_performance_percentage = (parseInt(matching_team.team_total_earned_points) / total_points) * 100;

                return {
                    team: team_id,
                    team_name: team_name_obj[0].team,
                    team_performance_percent: Math.round(team_performance_percentage)
                };
            }
            return null;
        }));

        const filtered_team_performance = team_performance.filter(performance => performance !== null);

        return successResponse(res, filtered_team_performance, 'Team Performance calculated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};