// models/deliveryAssignment.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeliveryAssignment extends Document {
  order: mongoose.Types.ObjectId;
  deliveryBoy: mongoose.Types.ObjectId | null;
  status: "broadcasted" | "accepted" | "delivered" | "failed";
  rejectedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    deliveryBoy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["broadcasted", "accepted", "delivered", "failed"],
      default: "broadcasted",
    },
    rejectedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const DeliveryAssignment: Model<IDeliveryAssignment> =
  mongoose.models.DeliveryAssignment ||
  mongoose.model<IDeliveryAssignment>("DeliveryAssignment", DeliveryAssignmentSchema);

export default DeliveryAssignment;














// import mongoose from "mongoose";

// export interface IDeliveryAssignment {
//   _id?: mongoose.Types.ObjectId;
//   order: mongoose.Types.ObjectId;
//   broadcastedTo: mongoose.Types.ObjectId[];
//   assignedTo: mongoose.Types.ObjectId | null;
//   status: "broadcasted" | "assigned" | "completed";
//   acceptedAt?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>(
//   {
//     order: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: true,
//     },

//     broadcastedTo: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["broadcasted", "assigned", "completed"],
//       default: "broadcasted",
//     },

//     acceptedAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// );

// const DeliveryAssignment =
//   mongoose.models.DeliveryAssignment ||
//   mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);

// export default DeliveryAssignment;