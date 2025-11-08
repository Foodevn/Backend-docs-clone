import express from "express";
import {
    checkPermission,
} from "../controllers/documentPermissionController.js";

const router = express.Router();

router.post("/check", checkPermission);

export default router;