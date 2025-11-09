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

        return res.status(200).json({
            documentPermissions
        });

    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }

}

export const addUser = async (req, res) => {
    try {
        const { email, documentId } = req.body;
        if (!email) {
            return res.status(400).json({ message: "email là bắt buộc" });
        }
        //tìm người dùng theo email của người dùng
        const user = await db.select().from(users).where(eq(users.email, email));
        if (!user[0]) {
            return res.status(404).json({ message: 'email không tồn tại' })
        }

        //kiểm tra xem quyền này đã có chưa
        const checkExisting = await db.select().from(documentsPermissions).where(
            and(
                eq(documentsPermissions.userId, user[0].id),
                eq(documentsPermissions.documentId, documentId)
            )
        )
        if (checkExisting[0]) {
            return res.status(400).json({ message: "email đã có quyền trong tài liệu" })
        }

        //lấy id của người dùng cùng với id của tài liệu thêm bảng ghi mới với quyền chỉ xem
        const addPermission = await db.insert(documentsPermissions)
            .values({
                userId: user[0].id,
                documentId: documentId,
                permission: 'viewer',
            }).returning();

        //trả về id người dùng
        return res.status(200).json({
            userId: addPermission[0].userId,
        })
    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const updatePermission = async (req, res) => {
    try {
        const { documentId } = req.params;




        return res.status(200).json({

        })
    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const deletePermission = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.body.userId;
        const currentUser = req.user;

        if (!userId) {
            return res.status(400).json({
                message: "thiếu user id",
            })
        }
        //Kiểm tra quyền của người thực hiện hành động xóa
        const currentUserPermission = await db
            .select()
            .from(documentsPermissions)
            .where(
                and(
                    eq(documentsPermissions.documentId, documentId),
                    eq(documentsPermissions.userId, currentUser.id),
                    eq(documentsPermissions.permission, "admin"),
                )
            )
            .limit(1);

        if (!currentUserPermission[0]) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập tài liệu này",
            });
        }

        //kiem tra co quyen nay chua
        const existingPermission = await db
            .select()
            .from(documentsPermissions)
            .where(
                and(
                    eq(documentsPermissions.documentId, documentId),
                    eq(documentsPermissions.userId, userId),
                )
            )
            .limit(1);

        if (!existingPermission[0]) {
            return res.status(404).json({
                message: "Quyền này không tồn tại hoặc đã xóa",
            })
        }

        // Không cho phép xóa chính mình (admin cuối cùng)
        if (userId === currentUser.id) {
            // Kiểm tra xem còn admin nào khác không
            const allAdmins = await db
                .select()
                .from(documentsPermissions)
                .where(
                    and(
                        eq(documentsPermissions.documentId, documentId),
                        eq(documentsPermissions.permission, 'admin')
                    )
                );

            if (allAdmins.length === 1) {
                return res.status(400).json({
                    message: "Không thể xóa admin cuối cùng của tài liệu",
                });
            }
        }



        // XÓA permission
        await db
            .delete(documentsPermissions)
            .where(
                and(
                    eq(documentsPermissions.documentId, documentId),
                    eq(documentsPermissions.userId, userId),
                )
            );

        //Xóa thành công
        return res.status(200).json({
            message: "Xóa quyền thành công",
        });
    } catch (error) {
        console.error("Lỗi khi gọi documents permission", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}