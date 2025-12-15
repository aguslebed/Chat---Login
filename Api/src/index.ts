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

connectDB();

app.use(morgan("dev"));

// PNA (Private Network Access) support for Localhost <-> Vercel
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Private-Network", "true");
    next();
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
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