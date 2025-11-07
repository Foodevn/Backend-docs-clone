import express from "express";
import {
    getAllDocuments,
    getDocuments,
    addNewDocument,
    updateDocument,
    removeDocument,
} from "../controllers/documentController.js";

const route = express.Router();

route.get("/", getAllDocuments)
route.get("/:documentId", getDocuments)
route.post("/", addNewDocument)
route.put("/:documentId", updateDocument)
route.delete("/:documentId", removeDocument)

export default route;