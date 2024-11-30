import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth";
import noteRoutes from "./routes/noteRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: ["https://notenook-notes.netlify.app"],
}));
app.use(express.json());
app.use(cookieParser());


// Database Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/notes-app')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

app.get('/', () => {
    console.log("Server running");
})
app.use('/auth', authRoutes);
app.use('/note', noteRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});