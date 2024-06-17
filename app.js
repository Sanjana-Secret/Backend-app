
import pool, { setupDatabase } from './config/db.js';
await setupDatabase();
import express, { json } from 'express';
import { config } from 'dotenv';
import {errorHandler} from './middlewares/errorMiddleware.js';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './v1/users/routes/userRoutes.js';
import assetRoutes from './v1/assets/routes/assetRoutes.js';
import trainingRoutes from './v1/trainings/routes/trainingRoutes.js';
import approvalRoutes from './v1/approvals/routes/approvalRoutes.js';
import announcementRoutes from './v1/announcements/routes/announcementRoutes.js';
import leaveRoutes from './v1/leaves/routes/leaveRoutes.js';
import worksheetRoutes from './v1/worksheets/routes/worksheetRoutes.js';
import teamRoutes from './v1/teams/routes/teamRoutes.js';
import categoryRoutes from './v1/categories/routes/categoryRoutes.js';
import projectRoutes from './v1/projects/routes/projectRoutes.js';
import skillSetRoutes from './v1/skillsets/routes/skillsetRoutes.js';
import stickynotesRoutes from "./v1/stickynotes/routes/stickynotesRoutes.js";
import activityRoutes from "./v1/activity/routes/activityRoutes.js";
import dashboardRoutes from "./v1/dashboard/routes/dashboardRoutes.js";
import { runCronJobs } from './crons/schedulers.js';
import userDashboardRoutes from './v1/users/routes/userdashboardRoutes.js';
import policiesRoutes from "./v1/policies/routes/policiesRoutes.js"

const app = express();
config();
app.use(helmet());
app.use(json());
app.use(cors());
// Start the cron jobs
runCronJobs();
// Disable the X-Powered-By header
app.disable('x-powered-by');
// Import & Define API versions
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/asset', assetRoutes);
app.use('/api/v1/training', trainingRoutes);
app.use('/api/v1/approval', approvalRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/worksheet', worksheetRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/skillSet', skillSetRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/project', projectRoutes);
app.use("/api/v1/stickynotes", stickynotesRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/dashboard" , dashboardRoutes);
app.use("/api/v1/policy", policiesRoutes);
app.use("/api/v1/userDashboard", userDashboardRoutes);
// Catch-all route for undefined routes
app.use('/', (req, res) => {
  res.send({
      statusCode: 403,
      status: 'failure',
      message: 'Invalid API'
  })
});
app.use(errorHandler)

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
