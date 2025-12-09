import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes"
import connectDB from "./config/db";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

connectDB();

app.use(morgan("dev"));
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;