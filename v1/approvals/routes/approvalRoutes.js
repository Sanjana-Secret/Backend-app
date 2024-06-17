import express, { Router } from 'express';
const app = express()
const router = Router();
import {allAppVal} from '../../../utils/validation.js'
import {approvalByAdmin} from '../controllers/approvalController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"


app.put("/admin/approval",authenticateAdminSession, allAppVal, approvalByAdmin)
app.use("/", router);

export default app;