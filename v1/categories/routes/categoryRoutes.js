import express, { Router } from 'express';
import { createCategoryVal, updateCategoryVal, deleteIdVal} from '../../../utils/validation.js';
import { createCategoryForWorksheet, fetchCategoryForWorkSheet, updateCategoryForWorksheet, deleteCategoryForWorksheet} from '../controllers/categoryController.js';
const app = express()
const router = Router();
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/admin/create-category',authenticateAdminSession, createCategoryVal, createCategoryForWorksheet);
app.put('/admin/update-category/:id',authenticateAdminSession, updateCategoryVal, updateCategoryForWorksheet);
app.get('/fetch-all-categories',authenticateUserAdminSession, fetchCategoryForWorkSheet);
app.delete('/admin/delete-category/:id',authenticateAdminSession, deleteIdVal, deleteCategoryForWorksheet);

app.use("/", router);

export default app;