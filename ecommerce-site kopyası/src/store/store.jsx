import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../slices/ProductsSlice'

export const store = configureStore({
    reducer: {
        products: productsReducer

    },
})