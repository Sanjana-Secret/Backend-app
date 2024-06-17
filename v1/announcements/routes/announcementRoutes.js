import express, { Router } from 'express';
const app = express()
const router = Router();
import {crAnnVal, upAnnVal, delAnnVal, activityDateVal} from "../../../utils/validation.js"
import {createAnnouncement, fetchAnnouncements, deleteAnnouncements, updateAnnouncements, filterAnnouncementByDate} from '../controllers/announcementController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/add-announcement',authenticateAdminSession,crAnnVal, createAnnouncement);
app.get('/fetch-announcement',authenticateUserAdminSession, fetchAnnouncements);
app.delete('/admin/delete-announcement/:id',authenticateAdminSession, deleteAnnouncements);
app.put('/admin/update-announcement/:id',authenticateAdminSession,upAnnVal, updateAnnouncements);
app.get('/filter-announcement-by-date/:date',authenticateUserAdminSession, activityDateVal, filterAnnouncementByDate);

app.use("/", router);

export default app;