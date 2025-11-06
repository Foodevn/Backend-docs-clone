import { eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { documentsPermissions } from "../db/models/DocumentPermissions.js";
import { documents } from "../db/models/Documents.js";

export const getAllDocuments = async (req, res) => {
    try {
        const user = req.user;

        // lấy những id của tài liệu liên quan đến người dùng
        const documentPermissions = await db.select()
            .from(documentsPermissions)
            .where(eq(documentsPermissions.userId, user.id));
        const documentIds = documentPermissions.map(d => { return d.documentId });

        //lấy ra danh sách documnet theo những id
        const dsDocuments = await db.select().from(documents).where(inArray(documents.id, documentIds));

        // trả lại danh sách 
        return res.status(200).json({
            dsDocuments,
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getDocuments = async (req, res) => {
    try {
        const ds = [{ title: "document 1", content: "hahah" }]
        return res.status(200).json({
            ds,
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const updateDocument = async (req, res) => {
    try {
        const ds = [{ title: "document 1", content: "hahah" }]
        return res.status(200).json({
            ds,
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const removeDocument = async (req, res) => {
    try {
        const ds = [{ title: "document 1", content: "hahah" }]
        return res.status(200).json({
            ds,
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}