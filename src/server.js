import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { testDrizzleConnection } from "./db/index.js";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import documentRoute from "./routes/documentRoute.js";

import { protectedRoute } from "./middlewares/authMiddleware.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));


//public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/documents", documentRoute);


testDrizzleConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`server đang lắng nghe trên cổng ${PORT}`)
    })
})