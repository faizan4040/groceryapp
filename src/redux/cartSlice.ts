import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ICartItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
}

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
      const existing = state.cartData.find(
        (item) => item._id === action.payload._id
      )

      if (existing) {
        existing.quantity += 1
      } else {
        state.cartData.push({
          ...action.payload,
          quantity: 1
        })
      }

      saveCart(state.cartData) 
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload
      )

      saveCart(state.cartData) 
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(i => i._id === action.payload)
      if (item) item.quantity += 1

      saveCart(state.cartData) 
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(i => i._id === action.payload)

      if (item) {
        if (item.quantity === 1) {
          state.cartData = state.cartData.filter(
            i => i._id !== action.payload
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