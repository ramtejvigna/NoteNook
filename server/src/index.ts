import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import noteRoutes from "./routes/noteRoutes"

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Database Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/notes-app')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

app.use('/auth', authRoutes);
app.use('/note', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});