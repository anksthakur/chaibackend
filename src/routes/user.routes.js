import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

//register route
router.post("/register", registerUser);

export default router;
