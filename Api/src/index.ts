import express from "express";
import authRoutes from "./routes/authRoutes"

const app = express();

app.use(express.json());
app.use("/api", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;