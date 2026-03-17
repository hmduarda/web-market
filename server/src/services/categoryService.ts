import Category, { ICategory } from "../models/Category";

class CategoryService {
  async create(data: { name: string; description?: string }): Promise<ICategory> {
    return await Category.create(data);
  }

  async list(): Promise<ICategory[]> {
    return await Category.find().sort({ name: 1 });
  }

  async getById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async update(id: string, data: Partial<{ name: string; description: string }>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");
    await Category.findByIdAndDelete(id);
  }
}

export default new CategoryService();