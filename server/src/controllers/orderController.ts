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

    // Filtro de Segurança: tratar os produtos nulos
    const sanitizedOrders = orders.map((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      if (orderObj.items) {
        orderObj.items = orderObj.items.map((item: any) => {
          if (!item.productId) {
            item.productId = {
              _id: "deleted",
              name: "Produto Excluído",
              image: "",
            };
          }
          return item;
        });
      }
      return orderObj;
    });

    res.json(sanitizedOrders);
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

    // Filtro de Segurança
    const orderObj = order.toObject ? order.toObject() : order;
    if (orderObj.items) {
      orderObj.items = orderObj.items.map((item: any) => {
        if (!item.productId) {
          item.productId = {
            _id: "deleted",
            name: "Produto Excluído",
            image: "",
          };
        }
        return item;
      });
    }

    res.json(orderObj);
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

export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user!.id);
    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error: any) {
    if (error.message.includes("não está pendente") || error.message.includes("não pode mais ser cancelado")) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
};
