import { Router } from "express";

import {
  checkout,
  getMyOrders,
  getOrderById,
  updateStatus,
  cancelOrder,
} from "../controllers/orderController";

import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

router.post("/checkout", authenticate, checkout);

router.get("/", authenticate, getMyOrders);

router.get("/:id", authenticate, getOrderById);

router.patch("/:id/status", authenticate, authorizeAdmin, updateStatus);

router.patch("/:id/cancel", authenticate, cancelOrder);

export default router;
