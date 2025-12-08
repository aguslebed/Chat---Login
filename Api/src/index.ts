import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes"
import connectDB from "./config/db";
import morgan from "morgan";
import cors from "cors";

const app = express();

connectDB();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;