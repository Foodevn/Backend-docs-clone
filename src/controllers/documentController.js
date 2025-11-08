import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { documentsPermissions } from "../db/models/DocumentPermissions.js";
import { documents } from "../db/models/Documents.js";

export const getAllDocuments = async (req, res) => {
    try {
        const user = req.user;
        const dsDocuments = await db.select({
            id: documents.id,
            title: documents.title,
            content: documents.content,
            isPrivate: documents.isPrivate,
            createdAt: documents.createdAt,
            updatedAt: documents.updatedAt,
            permission: documentsPermissions.permission,
        })
            .from(documentsPermissions)
            .innerJoin(documents, eq(documentsPermissions.documentId, documents.id))
            .where(eq(documentsPermissions.userId, user.id));

        // console.log(dsDocuments)

        // trả lại danh sách 
        return res.status(200).json({
            dsDocuments,
        });
    } catch (error) {
        console.error("Lỗi khi gọi documents", error);
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
        console.error("Lỗi khi gọi documents", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const addNewDocument = async (req, res) => {
    try {
        // lấy dự liệu từ repuest gồm tile, content
        const { title, content } = req.body;
        const user = req.user;
        if (!title) {
            return res.status(400).json({ message: "tiêu đề của tài liệu là bắt buộc phải có" });
        }

        // tạo 1 bản ghi cho  tài liệu 
        const newDocument = await db
            .insert(documents)
            .values({
                title,
                content: content || "",
                isPrivate: true,
            })
            .returning();

        // tạo quyền cho người dùng bằng cách thêm 1 bản ghi cho bảng document_permission
        await db
            .insert(documentsPermissions)
            .values({
                userId: user.id,
                documentId: newDocument[0].id,
                permission: "admin",
                canShare: false,
            })

        return res.status(200).json({
            documentId: newDocument[0].id,
        });

    } catch (error) {
        console.error("Lỗi khi gọi documents", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const updateDocument = async (req, res) => {
    try {
        //lấy dữ liệu từ req

        const { title } = req.body;

        const { documentId } = req.params;
        if (!documentId) {
            return res.status(400).json({ message: "thiếu id của tài liệu không thể cập nhật" });
        }

        //kiem tra document co ton tai khong
        const existingDocument = await db
            .select()
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if (!existingDocument) {
            return res.status(400).json({ message: "id tài liệu không hợp lệ" });
        }

        //cập nhật title
        const documentUpdate = await db
            .update(documents)
            .set({
                title,
            })
            .where(eq(documents.id, documentId))
            .returning();

        return res.status(200).json({
            id: documentUpdate[0].id,
        });
    } catch (error) {
        console.error("Lỗi khi gọi documents", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const removeDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const permission = req.body.permission;
        const user = req.user;

        //kiem tra document co ton tai khong
        const existingDocument = await db
            .select()
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if (!existingDocument) {
            return res.status(400).json({ message: "id tài liệu không hợp lệ" });
        }

        //xoa lien ket giua user vao document
        await db.delete(documentsPermissions).where(
            and(
                eq(documentsPermissions.documentId, documentId),
                eq(documentsPermissions.userId, user.id)
            )
        );

        if (permission == "admin") {
            //xoa document
            await db.delete(documents).where(eq(documents.id, documentId));
        }

        return res.status(200).json({

        });
    } catch (error) {
        console.error("Lỗi khi gọi documents", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}