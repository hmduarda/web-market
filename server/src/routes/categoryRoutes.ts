import { Router } from "express";
import {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategoryById);

router.post("/", createCategory);
router.put("/:id", authenticate, authorizeAdmin, updateCategory);
router.delete("/:id", authenticate, authorizeAdmin, deleteCategory);

export default router;