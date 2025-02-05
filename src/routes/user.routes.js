import { Router } from "express";
import { registerUser, loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Register route with image upload
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  registerUser
);

// Login route
router.route("/login").post(loginUser);

// Secured logout route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
export default router;
