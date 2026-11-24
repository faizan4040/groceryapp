import mongoose from "mongoose";

export const UNITS = ["kg", "g", "liter", "ml", "piece", "pack"] as const;

export interface IVariant {
  label: string;          // "100 g", "1 kg", "6 pack" — what the customer picks
  quantity?: number;      // 100
  unit?: string;          // "g"
  price: number;          // selling price after discount
  originalPrice?: number; // MRP (shown struck through)
  discount?: number;      // %
  stock?: number;
  image?: string;         // optional photo for this pack size
}

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
  images?: string[];
  description?: string;
  variants?: IVariant[];
  tags?: string[];
  highlights?: { title: string; text?: string }[];
  ingredients?: string;
  nutrition?: { label: string; value: string }[];
  nutritionServing?: string;
  featured?: boolean;
  featuredAt?: Date;
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
      enum: UNITS,
    },
    image: {
      type: String,
      required: true,
    },

    /* ── optional product-page details ── */
    images: { type: [String], default: undefined },
    description: { type: String },
    // pack sizes, e.g. [{ label: "100 g", price: 60 }, { label: "500 g", price: 260 }]
    variants: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          quantity: { type: Number, min: 0 },
          unit: { type: String, enum: UNITS },
          price: { type: Number, required: true, min: 0 },
          originalPrice: { type: Number, min: 0 },
          discount: { type: Number, min: 0, max: 100, default: 0 },
          stock: { type: Number, min: 0, default: 0 },
          image: { type: String },
        },
      ],
      default: undefined,
    },
    tags: { type: [String], default: undefined },          // short chips, e.g. "No added colour"
    highlights: {                                           // "Why you'll love it"
      type: [{ title: { type: String, required: true }, text: { type: String } }],
      default: undefined,
    },
    ingredients: { type: String },
    nutrition: { type: [{ label: String, value: String }], default: undefined },
    nutritionServing: { type: String },                    // e.g. "Per 100 g"

    // shown in the home-page "Featured" carousel when true (toggled from admin → View Grocery)
    featured: { type: Boolean, default: false, index: true },
    featuredAt: { type: Date },
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
