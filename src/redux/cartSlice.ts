import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ICartItem {
  unit: string
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  /** pack size label, e.g. "100 g" — set when the product has variants */
  variant?: string
  /** unique line id: `${_id}` or `${_id}::${variant}` */
  cartKey?: string
}

/** The id that identifies one cart line (product + pack size). */
export const lineKey = (item: Pick<ICartItem, "_id" | "cartKey">) => item.cartKey ?? item._id

interface ICartState {
  cartData: ICartItem[]
}

const loadCart = (): ICartItem[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart")
    return data ? JSON.parse(data) : []
  }
  return []
}

const initialState: ICartState = {
  cartData: loadCart() 
}

const saveCart = (cartData: ICartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cartData))
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const key = lineKey(action.payload)
      const existing = state.cartData.find((item) => lineKey(item) === key)
      const qty = Math.max(1, action.payload.quantity || 1)

      if (existing) {
        existing.quantity += qty
      } else {
        state.cartData.push({ ...action.payload, cartKey: key, quantity: qty })
      }

      saveCart(state.cartData)
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter(
        (item) => lineKey(item) !== action.payload
      )

      saveCart(state.cartData) 
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(i => lineKey(i) === action.payload)
      if (item) item.quantity += 1

      saveCart(state.cartData) 
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(i => lineKey(i) === action.payload)

      if (item) {
        if (item.quantity === 1) {
          state.cartData = state.cartData.filter(
            i => lineKey(i) !== action.payload
          )
        } else {
          item.quantity -= 1
        }
      }

      saveCart(state.cartData)
    },

    clearCart: (state) => {
      state.cartData = []
      saveCart(state.cartData) 
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer