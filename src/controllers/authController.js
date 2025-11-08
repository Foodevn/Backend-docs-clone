// @ts-nocheck
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { users } from "../db/models/User.js";
import { db } from "../db/index.js"; // file khởi tạo drizzle
import { eq } from "drizzle-orm";
import { sessions } from "../db/models/Session.js";


const ACCESS_TOKEN_TTL = "30m"; // thuờng là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Không thể thiếu username, password, email, firstName, và lastName",
            });
        }

        // kiểm tra username tồn tại chưa
        const duplicate = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (duplicate.length) {
            return res.status(409).json({ message: "username đã tồn tại" });
        }

        // mã hoá password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

        // tạo user mới
        await db.insert(users).values({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        })

        // return
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signIn = async (req, res) => {
    try {
        // lấy inputs
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu username hoặc password." });
        }

        // lấy hashedPassword trong db để so với password input
        const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (!user.length) {
            return res
                .status(401)
                .json({ message: "username hoặc password không chính xác" });
        }

        // kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user[0].hashedPassword);

        if (!passwordCorrect) {
            return res
                .status(401)
                .json({ message: "username hoặc password không chính xác1" });
        }

        // nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign(
            { userId: user[0].id },
            // @ts-ignore
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // tạo session mới để lưu refresh token
        await db.insert(sessions).values({
            userId: user[0].id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })

        // trả refresh token về trong cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", //backend, frontend deploy riêng
            maxAge: REFRESH_TOKEN_TTL,
        });

        // trả access token về trong res
        return res
            .status(200)
            .json({ message: `User ${user.displayName} đã logged in!`, accessToken });

    } catch (error) {
        console.error("Lỗi khi gọi signIn", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signOut = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;

        if (token) {
            // xoá refresh token trong Session
            await db.delete(sessions).where(eq(sessions.refreshToken, token));

            // xoá cookie
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi signOut", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Token không tồn tại." });
        }

        // so với refresh token trong db
        const session = await db.select().from(sessions).where(eq(sessions.refreshToken, token)).limit(1);

        if (!session.length) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        // kiểm tra hết hạn chưa
        if (session[0].expiresAt < Date.now()) {
            return res.status(403).json({ message: "Token đã hết hạn." });
        }

        // tạo access token mới
        const accessToken = jwt.sign(
            {
                userId: session[0].userId,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // return
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Lỗi khi gọi refreshToken", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};






