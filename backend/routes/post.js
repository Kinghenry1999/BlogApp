import express from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/post.js';
import { upload } from '../middleware/uploads.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/create', upload.single('image'), createPost);
router.put('/posts/:id', upload.single('image'), updatePost);
router.delete('/posts/:id', deletePost);

export default router;

