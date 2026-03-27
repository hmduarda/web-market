import { Schema, Types } from "mongoose";
import { IProduct } from "./Product";

export interface ICartItem {
  productId: Types.ObjectId | IProduct;
  quantity: number;
  unitPrice: number;
}

export const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);