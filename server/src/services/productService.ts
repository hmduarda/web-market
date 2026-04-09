import Product, { IProduct } from "../models/Product";
import fs from "fs";
import path from "path";

class ProductService {

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categories?: string[];
  }): Promise<IProduct> {
    const product = new Product(data);
    await product.save();
    return await product.populate({ path: "categories", strictPopulate: false });
  }

  async listProducts(): Promise<IProduct[]> {
    return await Product.find().populate({ path: "categories", strictPopulate: false }).sort({ createdAt: -1 });
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate({ path: "categories", strictPopulate: false });
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      image: string;
      categories: string[];
    }>
  ): Promise<IProduct | null> {
    const product = await Product.findById(id);
    
    if (product && data.image && product.image !== data.image) {
      this.deleteImageFile(product.image);
    }
    
    return await Product.findByIdAndUpdate(id, data, { new: true }).populate({ path: "categories", strictPopulate: false });
  }

  async getProductsByCategory(categories: string[]): Promise<IProduct[]> {
    if (!categories || categories.length === 0) {
      throw new Error("Validation Error: Nenhuma categoria informada.");
    }

    return await Product.find({
      categories: { $in: categories },
    }).populate({ path: "categories", strictPopulate: false });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findById(id);
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    this.deleteImageFile(product.image);
    
    await Product.findByIdAndDelete(id);
  }

  private deleteImageFile(imageUrl: string): void {
    try {
      const filename = imageUrl.replace("/uploads/", "");
      const filepath = path.join(__dirname, "../../uploads", filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error("Error deleting image file:", error);
    }
  }

}

export default new ProductService();