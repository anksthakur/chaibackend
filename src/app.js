import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static("public"));

// Use cookie parser
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

export { app };
