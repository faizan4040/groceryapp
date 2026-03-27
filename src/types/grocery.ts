import { Types } from "mongoose"

export interface IGrocery {
  _id: string | Types.ObjectId
  name: string
  price: number | string
  originalPrice?: number | string
  discount?: number | string
  image: string
  images?: string[]
  unit?: string
  category?: string
  stock?: number
  description?: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  highlights?: string[]
}


// export interface IGrocery {
//   _id: string;
//   name: string;
//   category: string;
//   price: string | number;
//   originalPrice?: string | number;
//   discount?: number;
//   stock?: number;
//   unit: string;
//   image: string;
// }