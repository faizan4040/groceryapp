import mongoose, { Schema, Document } from "mongoose";

export interface IGrocery extends Document {
  name: string;
  category: string;
  unit: string;
  price: number;
  file: string;
  image: string;
  createdAt: Date;
}

const GrocerySchema = new Schema<IGrocery>(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    unit:     { type: String, required: true },
    price:    { type: Number, required: true },
    file:     { type: String },
    image:    { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Grocery ||
  mongoose.model<IGrocery>("Grocery", GrocerySchema);