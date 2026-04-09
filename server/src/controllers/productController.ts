import productService from "../services/productService";
import { AuthRequest } from "../middlewares/auth";
import { Request, Response, NextFunction } from "express";

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, stock, categories } = req.body;
    
    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }
    
    const image = `/uploads/${req.file.filename}`;
    const parsedCategories = categories ? JSON.parse(categories) : undefined;
    
    const product = await productService.createProduct({ 
      name, 
      description, 
      price: Number(price), 
      stock: Number(stock), 
      image,
      categories: parsedCategories,
    });
    
    res.status(201).json({
      message: "Product created successfully",
      product
    });
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
    const { name, description, price, stock, categories } = req.body;
    
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const parsedCategories = categories ? JSON.parse(categories) : undefined;
    
    const product = await productService.updateProduct(id, { 
      name, 
      description, 
      price: price ? Number(price) : undefined, 
      stock: stock ? Number(stock) : undefined, 
      image,
      categories: parsedCategories,
    });
    
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    
    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let categoriesParam = req.query.categories;
    if (Array.isArray(categoriesParam)) {
      categoriesParam = categoriesParam.join(",");
    }

    if (!categoriesParam || typeof categoriesParam !== "string" || categoriesParam.trim() === "") {
      res.status(400).json({ error: "Nenhuma categoria foi enviada na requisição." });
      return;
    }

    const categoriesArray = categoriesParam
      .split(",")
      .map((category) => category.trim())
      .filter((category) => category.length > 0);

    if (categoriesArray.length === 0) {
      res.status(400).json({ error: "Lista de categorias inválida." });
      return;
    }

    const products = await productService.getProductsByCategory(categoriesArray);
    res.status(200).json(products);
  } catch (error: any) {
    if (error.message && error.message.includes("Validation Error")) {
      res.status(400).json({ error: error.message });
      return;
    }
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