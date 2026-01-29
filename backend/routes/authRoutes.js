import express from "express";
import { registerAdmin, loginAdmin, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", getMe);

export default router;
