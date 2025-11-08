import { db } from "../db/index.js";
import { and, eq, inArray } from "drizzle-orm";
import { documentsPermissions, users } from "../db/schema.js";


export const checkPermission = async (req, res) => {
    try {
        const { documentId } = req.body;
        const user = req.user;

        if (!user.id || !documentId) {
            return res.status(400).json({ message: "thiếu userId hoặc documentId" });
        }

        // console.log(documentId, user.id)

        const existingDocumentPermission = await db
            .select()
            .from(documentsPermissions)
            .where(
                and(
                    eq(documentsPermissions.userId, user.id),
                    eq(documentsPermissions.documentId, documentId),
                ))
        // console.log(existingDocumentPermission)

        if (!existingDocumentPermission[0]) {
            return res.status(404).json({ message: "thiếu userId hoặc documentId" });
        }

        return res.status(200).json({
            permission: existingDocumentPermission[0].permission,
        });
    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getDocumentsPermissions = async (req, res) => {
    try {
        const { documentId } = req.params;

        // lay permission có thông tin những người dùng và có quyền của những người đấy theo documentId;
        const documentPermissions = await db
            .select({
                userId: documentsPermissions.userId,
                userName: users.username,
                email: users.email,
                displayName: users.displayName,
                avartarUrl: users.avatarUrl,
                avartarId: users.avatarId,
                bio: users.bio,
                phone: users.phone,
                permission: documentsPermissions.permission,
                documentId: documentsPermissions.documentId,
                createAt: documentsPermissions.createdAt,
            })
            .from(documentsPermissions)
            .innerJoin(users, eq(documentsPermissions.userId, users.id))
            .where(eq(documentsPermissions.documentId, documentId))
        console.log(documentPermissions);

        return res.status(200).json({
            documentPermissions
        });

    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }

}