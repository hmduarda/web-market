import Cart, { ICart } from "../models/Cart";
import Product from "../models/Product";

class CartService {
  async getCart(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<ICart> {
    if (quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity,
        unitPrice: product.price,
      });
    }

    await cart.save();

    return cart;
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    if (quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      throw new Error("Product not in cart");
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return cart;
  }

  async clearCart(userId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
  }
}

export default new CartService();