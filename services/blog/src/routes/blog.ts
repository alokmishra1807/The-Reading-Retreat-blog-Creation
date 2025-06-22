import  express  from "express";
import { addComment, allBlogs, deleteComment, getAllComments, getSavedBlog, getSingleBlog, saveBlog } from "../controllers/blogs.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/blogs/all",allBlogs);
router.get("/blogs/:id",getSingleBlog);
router.post("/comment/:id", isAuth, addComment);
router.get("/comment/:id", getAllComments);
router.delete("/comment/:commentid", isAuth, deleteComment);
router.post("/save/:blogid", isAuth, saveBlog);
router.get("/blog/saved/all", isAuth, getSavedBlog);
export default router;