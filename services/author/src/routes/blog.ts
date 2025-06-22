import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';
import { aiBlogResponse, aiDescriptionResponse, aiTitleResponse, createBlog, deleteBlog, updateBlog } from '../controllers/blogs.js';

const router = express.Router();

router.post("/blog/new",isAuth,uploadFile,createBlog);
router.post("/blog/update/:id",isAuth,uploadFile,updateBlog);
router.delete("/blog/delete/:id",isAuth,deleteBlog);
router.post("/ai/title",aiTitleResponse);
router.post("/ai/description",aiDescriptionResponse)
router.post("/ai/blog",aiBlogResponse);

export default router;