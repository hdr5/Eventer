import express from "express";
import { reverseLocation, searchLocation } from "../controllers/locationController.js";

const router = express.Router();

router.get("/search", searchLocation);
router.get("/reverse", reverseLocation);


export default router;