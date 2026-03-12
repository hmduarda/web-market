import { Router } from "express";
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

// Rotas públicas
router.get("/", listProducts);
router.get("/:id", getProductById);

// Rotas privadas — somente admin
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
