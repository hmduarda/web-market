import mongoose, { Document, Schema } from "mongoose";
import { ICartItem, cartItemSchema } from "./CartItem";
import { IUser } from "./User";

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  items: ICartItem[];
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;