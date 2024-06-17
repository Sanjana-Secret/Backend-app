import express, { Router } from 'express';
import { adminDashboard, fetchApprovalData, fetchActivityAndAnnouncementData } from '../controllers/dashboardController.js';
const app = express()
const router = Router();
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"

app.get('/admin/admin-dashboard',authenticateAdminSession, adminDashboard);
app.get('/admin/fetch-approval-data',authenticateAdminSession, fetchApprovalData);
app.get('/admin/fetch-activity-announcement',authenticateAdminSession, fetchActivityAndAnnouncementData);


app.use("/", router);

export default app;