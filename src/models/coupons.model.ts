import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
},
  discountType: { 
    type: String, 
    enum: ["percentage", "fixed"], 
    required: true 
},
  discountValue: { 
    type: Number, 
    required: true 
},
  expiryDate: { 
    type: Date, 
    required: true 
},
  usageLimit: { 
    type: Number, 
    default: 0 
},
  usedCount: { 
    type: Number, 
    default: 0 
},
  minPurchase: {
     type: Number, 
     default: 0 
    },

  isActive: { 
    type: Boolean, 
    default: true 
},
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);