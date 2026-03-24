export interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string | number;
  originalPrice?: string | number;
  discount?: number;
  stock?: number;
  unit: string;
  image: string;
}