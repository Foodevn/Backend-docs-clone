// ===== FILE SERVER.JS - BACKEND SERVER VỚI SOCKET.IO =====

import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 5000;

const server = createServer();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // URL của Next.js app
        methods: ["GET", "POST"]
    },
});

// Lưu trữ documents trong memory (hoặc dùng database)
const documents = {};

// ===== XỬ LÝ KẾT NỐI SOCKET.IO =====
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // 1️⃣ Client tham gia vào room của document
    socket.on("joinDoc", (docId) => {
        socket.join(docId);

        // Khởi tạo document nếu chưa có
        if (!documents[docId]) {
            documents[docId] = "<p></p>"; // Nội dung mặc định
        }

        // Gửi nội dung hiện tại cho client mới join
        socket.emit("loadDoc", documents[docId]);
        console.log(`📄 Client ${socket.id} joined document: ${docId}`);
    });

    // 2️⃣ Client gửi thay đổi nội dung
    socket.on("editDoc", ({ docId, content }) => {
        console.log(`✏️ Document ${docId} updated by ${socket.id}`);

        // Lưu nội dung mới
        documents[docId] = content;

        // Gửi update cho TẤT CẢ clients khác trong room (trừ người gửi)
        socket.to(docId).emit("receiveUpdate", content);
    });

    // 3️⃣ Client ngắt kết nối
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Socket.IO Server running on http://localhost:${PORT}`);
});