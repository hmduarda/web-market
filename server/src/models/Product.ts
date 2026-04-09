import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./Category";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categories: mongoose.Types.ObjectId[] | ICategory[];
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: { type: String, required: true },
        categories: [{
            type: Schema.Types.ObjectId,
            ref: "Category",
        }],
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
