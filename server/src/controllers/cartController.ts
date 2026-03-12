import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import cartService from "../services/cartService";


export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const cart = await cartService.getCart(req.user!.id);

    res.json(cart);

  } catch (error) {
    next(error);
  }

};

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const { productId, quantity } = req.body;

    const cart = await cartService.addToCart(
      req.user!.id,
      productId,
      quantity
    );

    res.json({
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    next(error);
  }

};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const { quantity } = req.body;
    const productId = req.params.productId as string;

    const cart = await cartService.updateCartItem(
      req.user!.id,
      productId,
      quantity
    );

    res.json({
      message: "Cart updated",
      cart,
    });

  } catch (error) {
    next(error);
  }

};

export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const productId = req.params.productId as string;

    const cart = await cartService.removeFromCart(
      req.user!.id,
      productId
    );

    res.json({
      message: "Product removed from cart",
      cart,
    });

  } catch (error) {
    next(error);
  }

};

export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const cart = await cartService.clearCart(req.user!.id);

    res.json({
      message: "Cart cleared",
      cart,
    });

  } catch (error) {
    next(error);
  }

};