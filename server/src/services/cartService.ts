import Cart, { ICart } from "../models/Cart";
import Product from "../models/Product";


class CartService {

  async getCart(userId: string): Promise<ICart> {

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        total: 0,
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

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        total: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {

      cart.items[itemIndex].quantity += quantity;

    } else {

      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      });

    }

    this.calculateTotal(cart);

    await cart.save();

    return cart;
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<ICart> {

    if (quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      throw new Error("Product not in cart");
    }

    item.quantity = quantity;

    this.calculateTotal(cart);

    await cart.save();

    return cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<ICart> {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    this.calculateTotal(cart);

    await cart.save();

    return cart;
  }

  async clearCart(userId: string): Promise<ICart> {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return cart;
  }

  private calculateTotal(cart: ICart) {

    cart.total = cart.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

  }

}

export default new CartService();