import express from "express";
import { login } from "../Controls/auth.js";

const router=express.Router();


router.post("/login",login)

export default router;