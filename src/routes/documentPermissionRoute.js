import express from "express";
import {
    checkPermission,
    getDocumentsPermissions,

} from "../controllers/documentPermissionController.js";

const router = express.Router();

router.post("/check", checkPermission);
router.get("/id/:documentId", getDocumentsPermissions);

export default router;