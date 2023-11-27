import express from "express";
import {getFeeds,getuserFeeds,likedFeeds}  from "../Controls/posts.js"
import { verifyToken } from "../middleware/auth.js";


const router=express.Router();

router.get("/",verifyToken,getFeeds)
router.get("/:userId/posts",verifyToken,getuserFeeds)

router.patch("/:id/like",verifyToken,likedFeeds)

export default router;