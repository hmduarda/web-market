import { Request, Response, NextFunction } from "express";
import categoryService from "../services/categoryService";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const category = await categoryService.create({ name, description });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await categoryService.list();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.update(req.params.id, { name, description });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await categoryService.delete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};