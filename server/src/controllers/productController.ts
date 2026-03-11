import productService from "../services/productService";
import { AuthRequest } from "../middlewares/auth";
import { Request, Response, NextFunction } from "express";

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, stock, image } = req.body;
    const product = await productService.createProduct({ name, description, price, stock, image });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await productService.listProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image } = req.body;
    const product = await productService.updateProduct(id, { name, description, price, stock, image });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ message: "Product deleted  successfully" });
  } catch (error) {
    next(error);
  }
}; 
