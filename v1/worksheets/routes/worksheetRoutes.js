import express, { Router } from 'express';
const app = express()
const router = Router();
import {createUserWorksheet, updateUserWorksheet, deleteUserWorksheet, fetchUserWorksheet} from '../controllers/worksheetController.js';
import {calculatePerformanceForTeam } from "../controllers/performanceController.js"
import {createWorksheetVal, updateWorksheetVal, deleteUserWorksheetVal, fetchUserWorksheetVal} from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"
import { generateUserWorksheetExcel } from '../../../crons/cronFunctions.js';



app.post('/create-worksheet', authenticateUserSession, createWorksheetVal, createUserWorksheet);
app.put('/update-worksheet/:id/:emp_id', authenticateAdminSession, updateWorksheetVal, updateUserWorksheet);
app.delete('/delete-worksheet/:id/:emp_id',deleteUserWorksheetVal, deleteUserWorksheet);
app.get("/fetch-user-worksheet/:emp_id", authenticateUserAdminSession, fetchUserWorksheetVal, fetchUserWorksheet);
app.get("/admin/calculate-team-performance", authenticateAdminSession, calculatePerformanceForTeam);
app.post("/upload-worksheet",generateUserWorksheetExcel)

// ##currently commented, as this is converted to a cron, but needs to be here for testing or any change. DO NOT DELETE OR REMOVE THIS API.
// app.get("/calculate-performance", lockYearlyEarnedPointsForEachEmployee);  

app.use("/", router);

export default app;