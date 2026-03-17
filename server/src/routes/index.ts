import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/category", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;