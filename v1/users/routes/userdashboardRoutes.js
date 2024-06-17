import express, { Router } from 'express';
const app = express()
const router = Router();

import { userDashboard, feedbackForm, fetchFeedbackData, getDashboardImages, fetchUserPointsMonthlyAndYearly} from '../controllers/userDashboardController.js';
import { feedbackVal } from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/user-dashboard-feedback',authenticateUserAdminSession, feedbackVal,feedbackForm);
app.get('/admin/fetch-user-feedback',authenticateAdminSession, fetchFeedbackData);
app.get('/user-dashboard/:emp_id',authenticateUserSession, userDashboard);
app.get('/get-dashboard-images',authenticateUserSession, getDashboardImages);
app.get('/get-user-points-data-for-graph/:emp_id',authenticateUserSession, fetchUserPointsMonthlyAndYearly);

app.use("/", router);
export default app;