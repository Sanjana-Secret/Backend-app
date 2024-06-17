import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday, addLeaveTypeAndCount,
    fetchLeaveTypesAndTheirCount, leaveRequest, getUserLeaveDataForDashboard, 
    getUserLeaveData, fetchLeaveTakenOverview, updateLeaveTypeAndCount, deleteLeaveTypeAndCount,fetchHolidayList, deleteHoliday, 
    getUserAllLeaveData} from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveCountVal, leaveRequestVal, updateLeaveTypeAndCountVal, deleteLeaveTypeAndCountVal, getUserLeaveDashboardData, fetchLeaveOverviewVal, getTrnVal} from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/add-holiday', authenticateAdminSession, addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id', authenticateAdminSession, updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type-and-count', authenticateAdminSession, addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave-type-and-count/:id/:leave_type_id', authenticateAdminSession, updateLeaveTypeAndCountVal, updateLeaveTypeAndCount);
app.delete('/admin/delete-leave-type-and-count/:id/:leave_type_id', authenticateAdminSession, deleteLeaveTypeAndCountVal, deleteLeaveTypeAndCount);
app.get('/fetch-leave-type-and-count', authenticateUserAdminSession, fetchLeaveTypesAndTheirCount);
app.post('/leave-request', authenticateUserSession, leaveRequestVal, leaveRequest);
app.get('/get-user-leave-dashboard-data/:id', authenticateUserSession, getUserLeaveDashboardData, getUserLeaveDataForDashboard);
app.get('/user-leave-data', getUserLeaveData);
app.get('/user-all-leave-data', authenticateUserSession, getTrnVal, getUserAllLeaveData);
app.post('/fetch-leave-overview', authenticateUserSession, fetchLeaveOverviewVal, fetchLeaveTakenOverview);
app.get('/fetch-holiday-list', authenticateUserAdminSession, fetchHolidayList);
app.delete('/admin/delete-holiday/:id', authenticateAdminSession, deleteHoliday);

app.use("/", router);

export default app;