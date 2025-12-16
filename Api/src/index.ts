import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes"
import messageRoutes from "./routes/messageRoutes"
import connectDB from "./config/db";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { socketController } from "./sockets/socket";

const app = express();


connectDB();

app.use(morgan("dev"));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

socketController(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;