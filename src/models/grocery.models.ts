import mongoose from "mongoose";

interface IGroceryDoc {
  _id: mongoose.Types.ObjectId,
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGroceryDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "g", "liter", "ml", "piece", "pack"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Grocery =
  mongoose.models.Grocery ||
  mongoose.model<IGroceryDoc>("Grocery", grocerySchema);

export default Grocery;







// import mongoose from "mongoose";

// interface IGrocery {
//   name: string;
//   category: string;
//   price: number;
//   unit: string;
//   file?: string;
//   image: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const grocerySchema = new mongoose.Schema<IGrocery>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
    
//     category: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number, 
//       required: true,
//     },
//     unit: {
//       type: String,
//       required: true,
//       enum:["kg", "g", "liter", "ml", "piece", "pack"]
//     },
//     file: {
//       type: String,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true, 
//   }
// );

// const Grocery=mongoose.models.Grocery || mongoose.model("Grocery",grocerySchema)
// export default Grocery
