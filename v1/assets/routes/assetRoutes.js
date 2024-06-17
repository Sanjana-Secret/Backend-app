import express, { Router } from 'express';
import multer from 'multer';
const app = express()
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {crAssVal, assReqVal, fetUserAssVal} from '../../../utils/validation.js'
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets, updateAsset} from '../controllers/assetController.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"

app.post('/admin/create-asset',authenticateAdminSession, upload.single('file'), crAssVal, createAsset);
app.post('/asset-request',authenticateUserSession, assReqVal, assetRequest);
app.post('/user-asset',authenticateUserSession, fetUserAssVal, fetchUserAssets);
app.get('/admin/fetch-assets',authenticateAdminSession, fetchAssets);
app.delete('/admin/delete-asset/:id',authenticateAdminSession, deleteAsset);
app.put('/admin/update-asset/:id',authenticateAdminSession, upload.single('file'), updateAsset);

app.use("/", router);

export default app;