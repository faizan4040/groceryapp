import mongoose from "mongoose"

const GrocerySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    originalPrice: { 
      type: Number 
    },
    discount: { 
      type: Number 
    },
    image: { 
      type: String
     },
    images: { 
      type: [String]
     },
    unit: { 
      type: String
     },
    category: { 
      type: String
     },
    stock: { 
      type: Number,
      default: 100
    },
    description: { 
      type: String 
    },
    rating: { 
      type: Number
    },
    reviewCount: { 
      type: Number
    },
    tags: {
       type: [String]
    },
    highlights: { 
      type: [String]
    },
  },
  { timestamps: true }
)

export default mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema)

