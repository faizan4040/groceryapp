import mongoose from "mongoose"

export interface IDeliveryAssignment {
  _id?: mongoose.Types.ObjectId
  order: mongoose.Types.ObjectId
  broadcastedTo: string[] 
  assignedTo: string | null 
  status: "broadcasted" | "assigned" | "completed" | "failed"
  rejectedBy?: string[] 
  acceptedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    broadcastedTo: [
      {
        type: String, 
      },
    ],

    assignedTo: {
      type: String, 
      default: null,
    },

    status: {
      type: String,
      enum: ["broadcasted", "assigned", "completed", "failed"], 
      default: "broadcasted",
    },

    rejectedBy: [
      {
        type: String, 
      },
    ],

    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const DeliveryAssignment =
  mongoose.models.DeliveryAssignment ||
  mongoose.model("DeliveryAssignment", deliveryAssignmentSchema)

export default DeliveryAssignment














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