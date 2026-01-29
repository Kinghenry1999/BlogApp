import pool from "../config/db.js";

export const getPosts = async (req, res) => {
  try {
    const text = `SELECT id, title, content, image_url, created_at FROM posts ORDER BY created_at DESC`;
    const result = await pool.query(text);
    return res.status(200).json({ ok: true, posts: result.rows });
  } catch (err) {
    console.error("getPosts error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
};

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body || {};
        const file = req.file || null;

        const imageUrl = file ? `/uploads/posts/${file.filename}` : null;

        const text = `INSERT INTO posts (title, content, image_url) VALUES ($1, $2, $3) RETURNING *`;
        const values = [title || null, content || null, imageUrl];

        const result = await pool.query(text, values);
        return res.status(201).json({ ok: true, post: result.rows[0] });
    } catch (err) {
        console.error("createPost error:", err);
        return res.status(500).json({ ok: false, message: err.message });
    }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body || {};
    const file = req.file || null;

    if (file) {
      const imageUrl = `/uploads/posts/${file.filename}`;
      const text = `UPDATE posts SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *`;
      const values = [title || null, content || null, imageUrl, id];
      const result = await pool.query(text, values);
      return res.status(200).json({ ok: true, post: result.rows[0] });
    } else {
      const text = `UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *`;
      const values = [title || null, content || null, id];
      const result = await pool.query(text, values);
      return res.status(200).json({ ok: true, post: result.rows[0] });
    }
  } catch (err) {
    console.error('updatePost error:', err);
    return res.status(500).json({ ok: false, message: err.message });
  }
};

import fs from 'fs';
import path from 'path';

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    // fetch post to get image path
    const sel = await pool.query('SELECT image_url FROM posts WHERE id = $1', [id]);
    const post = sel.rows[0];
    if (!post) return res.status(404).json({ ok: false, message: 'Post not found' });

    // delete DB row
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    // attempt to delete file if exists
    if (post.image_url) {
      const filePath = path.join(process.cwd(), post.image_url.replace(/^\//, ''));
      fs.unlink(filePath, (err) => {
        if (err) console.warn('Failed to delete file:', filePath, err.message);
      });
    }

    return res.status(200).json({ ok: true, message: 'Post deleted' });
  } catch (err) {
    console.error('deletePost error:', err);
    return res.status(500).json({ ok: false, message: err.message });
  }
};

export default { createPost, updatePost, deletePost };