import express, { Router } from 'express';
import { createSkillSet, deleteSkillSet, fetchSkillSets, updateSkillSet } from '../controllers/skillsetController.js';
import { deleteIdVal,createSkillVal, updateSkillVal } from '../../../utils/validation.js';
const app = express()
const router = Router();
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/admin/create-skill', authenticateAdminSession, createSkillVal, createSkillSet);
app.put("/admin/update-skill/:id", authenticateAdminSession, updateSkillVal,updateSkillSet);
app.get('/fetch-skills', authenticateUserAdminSession, fetchSkillSets);
app.delete('/admin/delete-skill/:id', authenticateAdminSession, deleteIdVal, deleteSkillSet);

app.use("/", router);

export default app;