import express from "express";

import { login, register } from "../controllers/auth.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";

const router = express.Router();

router.route("/register").post(upload.single("profilePic"), register);
router.route("/login").post(login);

export default router;
