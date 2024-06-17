import express, { Router } from 'express';
// import { createTeamVal, updateTeamVal } from '../../../utils/validation';
import { createTeam, deleteTeam, fetchTeams, updateTeam } from '../controllers/teamController.js';
import { deleteIdVal, createTeamVal, updateTeamVal } from '../../../utils/validation.js';
const app = express()
const router = Router();
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/admin/create-team', authenticateAdminSession, createTeamVal, createTeam);
app.put('/admin/update-team/:id', authenticateAdminSession, updateTeamVal, updateTeam);
app.get('/fetch-all-teams', authenticateUserAdminSession, fetchTeams);
app.delete('/admin/delete-team/:id', authenticateAdminSession, deleteIdVal,deleteTeam);


app.use("/", router);

export default app;