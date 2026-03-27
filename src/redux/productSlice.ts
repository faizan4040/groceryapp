import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// TYPE
export interface IProduct {
  _id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  weight?: string
  images: string[]
  image?: string // for UI
}

// STATE
interface ProductState {
  products: IProduct[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null
}

// FETCH PRODUCTS
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      return data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

// SLICE
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false

        // IMPORTANT TRANSFORM
        state.products = action.payload.map((p: IProduct) => ({
          ...p,
          image: p.images?.[0] || '/fallback.png'
        }))
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default productSlice.reducer