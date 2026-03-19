import mongoose from "mongoose";

interface IUser {
 _id: mongoose.Types.ObjectId
  name: string
  email: string
  password?: string
  mobile?: string | null     
  role?: "user" | "deliveryBoy" | "admin" | null   
  image: string,
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  mobile: {
  type: String,
  required: false,  
  unique: true,
  sparse: true     
  },
  role: {
    type: String,
    enum: ["user", "deliveryBoy", "admin"],
    default: null      
  },
  image: {
    type: String,
  }

}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;