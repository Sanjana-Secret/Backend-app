import express, { Router } from 'express';
const app = express()
const router = Router();
import {addTrnVal, reqTrnVal, getTrnVal}from '../../../utils/validation.js'
import {addNewTraining, requestUserTraining, trainingCardsData, getUserTrainingData, deleteTrainingData, updateTrainingData, getEveryUserTrainingData} from '../controllers/trainingController.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/add-new-training', authenticateAdminSession, addTrnVal, addNewTraining);
app.post('/request-new-training', authenticateUserSession, reqTrnVal, requestUserTraining);
app.get('/training-cards', authenticateUserAdminSession, trainingCardsData);
app.post('/get-user-training', authenticateUserSession, getTrnVal, getUserTrainingData);
app.delete('/admin/delete-training/:id', authenticateAdminSession, deleteTrainingData);
app.put('/admin/update-training/:id', authenticateAdminSession, updateTrainingData);
app.get('/admin/display-all-users-training-data', authenticateAdminSession, getEveryUserTrainingData);

app.use("/", router);

export default app;