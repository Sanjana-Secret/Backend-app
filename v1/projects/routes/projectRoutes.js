import express, { Router } from 'express';
import { createProjectVal, deleteIdVal, updateProjectVal,createUserProjectVal, userUpdateProjectVal } from '../../../utils/validation.js';
import { createProject, deleteProject, fetchProjects, updateProject } from '../controllers/projectController.js';
import { createUserProject, fetchUserProjects, userUpdateProject, getUserProjectTimeline} from '../controllers/userProjectController.js';
const app = express()
const router = Router();
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/admin/create-project', authenticateAdminSession,  createProjectVal, createProject);
app.put('/admin/update-project/:id/:category_id', authenticateAdminSession, updateProjectVal, updateProject);
app.get('/fetch-all-projects', authenticateUserAdminSession, fetchProjects);
app.delete('/admin/delete-project/:id/:category_id', authenticateAdminSession, deleteIdVal, deleteProject);
app.post('/create-user-project',authenticateUserSession, createUserProjectVal, createUserProject);
app.get('/fetch-user-project/:emp_id',authenticateUserSession, fetchUserProjects);
app.put('/update-user-project/:emp_id/:project_id',authenticateUserSession, userUpdateProjectVal, userUpdateProject);
app.get('/fetch-user-project-timeline/:emp_id',authenticateUserSession, getUserProjectTimeline);


app.use("/", router);

export default app;