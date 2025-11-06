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
route.get("/:id", getDocuments)
route.post("/", addNewDocument)
route.put("/", updateDocument)
route.delete("/:id", removeDocument)

export default route;