import { Router } from "express";
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import { uploadSingle, handleUploadError } from "../middlewares/upload";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById);

router.post("/", authenticate, authorizeAdmin, uploadSingle, handleUploadError, createProduct);
router.put("/:id", authenticate, authorizeAdmin, uploadSingle, handleUploadError, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
