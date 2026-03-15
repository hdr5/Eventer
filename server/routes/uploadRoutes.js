import express from "express";
import { uploadImage, uploadMiddleware } from "../controllers/uploadController.js";

const router = express.Router();

// POST /api/uploads?type=avatar&id=USER_ID
// POST /api/uploads?type=event&id=EVENT_ID
router.post("/", uploadMiddleware, uploadImage);

export default router;
