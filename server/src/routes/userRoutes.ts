import { Router } from "express";
import { register, login, getProfile, listUsers, updateUser, deleteUser } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/:id", authenticate, getProfile);
router.get("/", authenticate, authorizeAdmin, listUsers);
router.put("/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
