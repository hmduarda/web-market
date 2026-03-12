import { Router } from "express";

import {
  checkout,
  getMyOrders,
  getOrderById,
  updateStatus,
} from "../controllers/orderController";

import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

router.post("/checkout", authenticate, checkout);

router.get("/", authenticate, getMyOrders);

router.get("/:id", authenticate, getOrderById);

router.patch("/:id/status", authenticate, authorizeAdmin, updateStatus);

export default router;
