import express from "express";
import {
    checkPermission,
    getDocumentsPermissions,
    addUser,
    updatePermission,
    deletePermission,
} from "../controllers/documentPermissionController.js";

const router = express.Router();

router.post("/check", checkPermission);
router.get("/id/:documentId", getDocumentsPermissions);
router.post("/add", addUser)
router.put("/:documentId", updatePermission);
router.delete("/:documentId", deletePermission);
export default router;