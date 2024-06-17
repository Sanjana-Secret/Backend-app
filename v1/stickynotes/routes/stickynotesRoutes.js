import express, { Router } from "express";
import {
  addStickyNotes,
  deleteStickyNotes,
  getStickyNotes,
} from "../controllers/stickynotesControllers.js";
import {adStiNoVal,  delStiNoVal, getStiNoVal } from "../../../utils/validation.js";
import {authenticateUserSession} from "../../../middlewares/userAuth.js"

const app = express();
const router = Router();

// Store temporary note
app.post("/add-stickynotes", authenticateUserSession, adStiNoVal, addStickyNotes);

// Retrieve temporary notes
app.get("/get-user-notes/:emp_id", authenticateUserSession, getStiNoVal, getStickyNotes);
app.delete(`/delete-stickynotes/:id/:emp_id`, authenticateUserSession, delStiNoVal, deleteStickyNotes);
app.use("/", router);

export default app;
