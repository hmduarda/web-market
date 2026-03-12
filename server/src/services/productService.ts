import Product, { IProduct } from "../models/Product";

class ProductService {

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  }): Promise<IProduct> {
    const product = new Product(data);
    await product.save();
    return product;
  }

  async listProducts(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 });
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      image: string;
    }>
  ): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product not found");
    }
  }

}

export default new ProductService();
