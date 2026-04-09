import Order, { IOrder } from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";

class OrderService {
  async checkout(userId: string): Promise<IOrder> {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    }

    const total = cart.items.reduce((acc, item) => {
      return acc + item.unitPrice * item.quantity;
    }, 0);

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const order = await Order.create({
      userId,
      items: orderItems,
      total,
      status: "pending",
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    return order;
  }

  async getMyOrders(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return orders;
  }

  async getOrderById(
    orderId: string,
    userId: string,
    role: string
  ): Promise<IOrder> {
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      throw new Error("Order not found");
    }

    if (role !== "admin" && order.userId.toString() !== userId) {
      throw new Error("Access denied");
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    status: IOrder["status"]
  ): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.productId");

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
  async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error("O pedido não pode mais ser cancelado pois não está pendente.");
    }

    try {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }

      order.status = "cancelled";
      await order.save();
      
      return order;
    } catch (error) {
      throw new Error("Falha ao cancelar pedido.");
    }
  }
}

export default new OrderService();
