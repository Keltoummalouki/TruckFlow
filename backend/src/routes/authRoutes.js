import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", loginLimiter, validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.get("/profile", authenticate, authController.getProfile);
router.get("/users", authenticate, authController.getUsers);

export default router;

