import { Router } from "express";
import { getProfile, listUsers, updateUser, deleteUser } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

router.get("/me", authenticate, getProfile);
router.get("/", authenticate, authorizeAdmin, listUsers);
router.put("/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
