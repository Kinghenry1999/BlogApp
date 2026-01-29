import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/post.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config()

const app = express();

// During local development allow the dev server origin (Vite may pick different ports).
app.use(cors({
  origin: 'https://blogapp-frontend-eta.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'));


app.use("/api/admin", authRoutes);
app.use("/api/admin", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
