import mongoose from "mongoose";

/* ─── Interface ─── */
export interface IOrder {
  _id?: mongoose.Types.ObjectId;

  user: mongoose.Types.ObjectId;

  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: number;        
    unit: string;
    image: string;
    quantity: number;
  }[];

  isPaid:boolean,
  totalAmount: number;     

  paymentMethod: "cod" | "online";

  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };

  status: "pending" | "out for delivery" | "delivered";

  createdAt?: Date;
  updatedAt?: Date;
}

/* ─── Schema ─── */
const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,   
          required: true,
        },
        unit: {
        type: String,
        default: "unit", 
        },
        image: {
          type: String,    
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    
    
    totalAmount: {
      type: Number,         
      required: true,
    },
    
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    
    isPaid:{
     type:Boolean,
     default:false
    },
    
    address: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      fullAddress: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    status: {
      type: String,
      enum: ["pending", "out for delivery", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true, 
  }
);

/* ─── Model Export ─── */
const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", orderSchema);

export default Order;