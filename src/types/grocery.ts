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
  highlights?: (string | { title: string; text?: string })[]
  variants?: { label: string; price: number; originalPrice?: number; discount?: number; stock?: number; quantity?: number; unit?: string; image?: string; _id?: string }[]
  ingredients?: string
  nutrition?: { label: string; value: string }[]
  nutritionServing?: string
  featured?: boolean
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