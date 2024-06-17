import userTable  from "../v1/users/models/userModel.js";
import assetTable  from "../v1/assets/models/assetModel.js";
import trainingTable from "../v1/trainings/models/trainingModel.js";
import usertrainingTable from "../v1/trainings/models/userTrainingModel.js";
import assetRequestTable  from "../v1/assets/models/userAssetModel.js";
import approvalTable  from "../v1/approvals/models/approvalModel.js";
import announcementTable from "../v1/announcements/models/announcementModel.js";
import holidayTable from "../v1/leaves/models/holidayModel.js";
import leaveDatesAndReasonTable from "../v1/leaves/models/leaveDatesAndReasonModel.js";
import leaveTypeCountTable from "../v1/leaves/models/leaveTypeCountModel.js";
import leaveTypeTable from "../v1/leaves/models/leaveTypeModel.js";
import userLeaveCountTable from "../v1/leaves/models/userLeaveCountModel.js";
import categoryTable from "../v1/categories/models/categoryModel.js";
import teamTable from "../v1/teams/models/teamModel.js";
import projectTable from "../v1/projects/models/projectModel.js";
import worksheetTable from "../v1/worksheets/models/worksheetModel.js";
import skillSetTable from "../v1/skillsets/models/skillsetModel.js";
import temporaryNotesTable from "../v1/stickynotes/models/stickynotesModel.js";
import policiesTable from "../v1/policies/models/policiesModel.js";
import userTeamsTable from "../v1/users/models/userTeamsModel.js";
import imagesTable from "../v1/images/imagesModel.js";
import feedbackFormTable from "../v1/users/models/userFeedbackModel.js";
import userProjectTable from "../v1/projects/models/userProjectModel.js";
import userYearlyPerformanceTable from "../v1/worksheets/models/userYearlyPerformanceModel.js";
import userPerformanceTable from "../v1/worksheets/models/userPerformanceModel.js";

export default [userTable, assetTable, trainingTable, usertrainingTable, assetRequestTable, approvalTable, announcementTable,
    holidayTable, leaveDatesAndReasonTable,leaveTypeTable, leaveTypeCountTable, userLeaveCountTable, categoryTable, teamTable,
    projectTable, worksheetTable, skillSetTable , temporaryNotesTable , policiesTable, userTeamsTable,
    userYearlyPerformanceTable, userPerformanceTable, imagesTable, feedbackFormTable, userProjectTable
];