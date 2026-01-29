import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const query = `
      INSERT INTO admin (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, email, password];
    const result = await pool.query(query, values);
    res.json({ message: "Admin registered successfully!", admin: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: "No admin found" });
    const admin = result.rows[0];
    if (admin.password !== password) return res.status(401).json({ message: "Password does not match" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
};
