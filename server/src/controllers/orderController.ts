import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import orderService from "../services/orderService";
import { IOrder } from "../models/Order";

export const checkout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await orderService.checkout(req.user!.id);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await orderService.getMyOrders(req.user!.id);

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user!.id,
      req.user!.role,
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.body as { status: IOrder["status"] };

    const order = await orderService.updateStatus(req.params.id, status);

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
};
