import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IOrderItem {
  grocery:  string;
  name:     string;
  price:    number;
  unit:     string;
  quantity: number;
  image:    string;
}

export interface IAddress {
  fullName:    string;
  mobile:      string;
  city:        string;
  state:       string;
  pincode:     string;
  fullAddress: string;
  latitude?:   number | null;
  longitude?:  number | null;
}

export interface IOrder extends Document {
  userId:        string;          
  items:         IOrderItem[];
  totalAmount:   number;
  address:       IAddress;
  paymentMethod: 'cod' | 'online';
  isPaid:        boolean;
  status:        'pending' | 'confirmed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled';

  assignmentDeliveryBoy?: mongoose.Types.ObjectId;
  assignment?: mongoose.Types.ObjectId

  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  createdAt?:    Date;
  updatedAt?:    Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  grocery:  { type: String, required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  unit:     { type: String, required: true },
  quantity: { type: Number, required: true },
  image:    { type: String, default: '' },
}, { _id: false });

const AddressSchema = new Schema<IAddress>({
  fullName:    { type: String, required: true },
  mobile:      { type: String, required: true },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  pincode:     { type: String, default: '' },
  fullAddress: { type: String, required: true },
  latitude:    { type: Number, default: null },
  longitude:   { type: Number, default: null },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
 
  userId: {
    type:     String,
    required: true,
    index:    true,
  },

  items:         { type: [OrderItemSchema], required: true },
  totalAmount:   { type: Number, required: true },
  address:       { type: AddressSchema, required: true },
  paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
  isPaid:        { type: Boolean, default: false },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },

  assignment:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "DeliveryAssignemnt",
     default: null
  },

  assignmentDeliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },

}, { timestamps: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;





