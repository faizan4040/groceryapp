import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['completed', 'pending', 'refunded'], 
    default: 'pending' 
  },
  method: { 
    type: String, 
    enum: ['Online', 'COD'], 
    required: true 
  },
  txnId: { type: String, unique: true },
  address: { type: String },
}, { timestamps: true });

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);