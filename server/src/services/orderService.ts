import Order, { IOrder } from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";

class OrderService {
  async checkout(userId: string): Promise<IOrder> {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Product not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      total: cart.total,
      status: "pending",
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    return order;
  }

  async getMyOrders(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return orders;
  }

  async getOrderById(
    orderId: string,
    userId: string,
    role: string,
  ): Promise<IOrder> {
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      throw new Error("Order not found");
    }

    if (role !== "admin" && order.user.toString() !== userId) {
      throw new Error("Access denied");
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    status: IOrder["status"],
  ): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    ).populate("items.product");

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
}

export default new OrderService();
