import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    allProducts: [],
    cart: [],
    favorites: [],
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
};

const apiKey = "0f949a15282324a8dc41067fd84eb8c8";
const FORM_ID = "251073649788976"

export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://api.jotform.com/form/251073649788976/payment-info?apiKey=${apiKey}`);

            console.log("API'den gelen veri:", response.data);

            const products = response.data.content?.products || [];

            const processedProducts = products.map(product => {

                const productCategory = product.category && product.category.trim() !== '' ?
                    product.category :
                    product.name.split(' ')[0];

                return {
                    ...product,
                    inCart: false,
                    isFavorite: false,
                    category: productCategory
                };
            });

            const productsWithConnections = processedProducts.map(product => {
                const firstWord = product.name.split(' ')[0];

                const connectedProducts = processedProducts
                    .filter(p => {
                        const pFirstWord = p.name.split(' ')[0];
                        return pFirstWord === firstWord && p.pid !== product.pid;
                    })
                    .map(p => p.pid);

                return {
                    ...product,
                    connectedProducts: JSON.stringify(connectedProducts)
                };
            });

            const uniqueCategories = [...new Set(productsWithConnections
                .filter(p => p.category && p.category.trim() !== '')
                .map(p => p.category))];

            return {
                products: productsWithConnections,
                categories: uniqueCategories
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            const category = action.payload;
            state.selectedCategory = category;

            if (category === "all") {
                state.products = state.allProducts;
            } else {
                state.products = state.allProducts.filter(
                    product => product.category === category
                );
            }
        },

        addToCart: (state, action) => {
            const addedProduct = state.products.find((p) => p.pid === action.payload.pid);
            const addedProductInAllProducts = state.allProducts.find((p) => p.pid === action.payload.pid);
            let addedProductInCart = state.cart.find((c) => (c.pid === action.payload.pid));

            if (addedProduct) {
                if (!addedProductInCart) {
                    addedProduct.inCart = true;
                    if (addedProductInAllProducts) {
                        addedProductInAllProducts.inCart = true;
                    }
                    state.cart.push(action.payload);
                } else {
                    alert("ürün zaten sepette");
                }
            }
        },
        increaseNumber: (state, action) => {
            const selectedProduct = state.products.find((p) => p.pid === action.payload.pid);
            const selectedProductInAllProducts = state.allProducts.find((p) => p.pid === action.payload.pid);
            const selectedInCart = state.cart.find((p) => p.pid === action.payload.pid);

            if (selectedProduct) {
                selectedProduct.hasQuantity++;
                if (selectedProductInAllProducts) {
                    selectedProductInAllProducts.hasQuantity++;
                }
                selectedInCart.hasQuantity++;
            }
        },
        decreaseNumber: (state, action) => {
            const selectedProduct = state.products.find((c) => c.pid === action.payload.pid);
            const selectedProductInAllProducts = state.allProducts.find((p) => p.pid === action.payload.pid);
            const selectedInCart = state.cart.find((p) => p.pid === action.payload.pid);

            if (selectedProduct) {
                selectedProduct.hasQuantity--;
                if (selectedProductInAllProducts) {
                    selectedProductInAllProducts.hasQuantity--;
                }
                selectedInCart.hasQuantity--;
            }
        },
        removeItem: (state, action) => {
            const removedProduct = state.products.find((p) => p.pid === action.payload.pid);
            const removedProductInAllProducts = state.allProducts.find((p) => p.pid === action.payload.pid);

            state.cart = state.cart.filter((cartItem) => (cartItem.pid !== action.payload.pid));

            if (removedProduct) {
                removedProduct.inCart = false;
                removedProduct.hasQuantity = 1;
            }

            if (removedProductInAllProducts) {
                removedProductInAllProducts.inCart = false;
                removedProductInAllProducts.hasQuantity = 1;
            }
        },
        addToFavorites: (state, action) => {
            const product = state.products.find(p => p.pid === action.payload.pid);
            const productInAllProducts = state.allProducts.find(p => p.pid === action.payload.pid);

            if (product) {
                product.isFavorite = true;
                if (productInAllProducts) {
                    productInAllProducts.isFavorite = true;
                }

                if (!state.favorites.some(p => p.pid === product.pid)) {
                    state.favorites.push(product);
                }
            }
        },
        removeFromFavorites: (state, action) => {
            const product = state.products.find(p => p.pid === action.payload.pid);
            const productInAllProducts = state.allProducts.find(p => p.pid === action.payload.pid);

            if (product) {
                product.isFavorite = false;
                if (productInAllProducts) {
                    productInAllProducts.isFavorite = false;
                }

                state.favorites = state.favorites.filter(p => p.pid !== product.pid);
            }
        },
        search: (state, action) => {
            state.products = state.allProducts.filter((p) => (
                p.name.toLowerCase().includes(action.payload.toLowerCase())
            ))
        },
        displayAllProducts: (state) => {
            state.products = state.allProducts;
        },
        categorize: (state, action) => {
            state.products = state.allProducts.filter((p) => (p.category === action.payload))
        },
        clearCart: (state) => {
            state.cart = [];

            state.products.forEach(product => {
                product.inCart = false;
                product.hasQuantity = 1;
            });

            state.allProducts.forEach(product => {
                product.inCart = false;
                product.hasQuantity = 1;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                const { products, categories } = action.payload;

                const processedProducts = products.map(product => {
                    const cartItem = state.cart.find((c) => c.pid === product.pid);
                    const favoriteItem = state.favorites.find(f => f.pid === product.pid);

                    return {
                        ...product,
                        inCart: cartItem ? true : false,
                        hasQuantity: cartItem ? cartItem.hasQuantity : 1,
                        isFavorite: favoriteItem ? true : false
                    };
                });

                state.products = processedProducts;
                state.allProducts = processedProducts;
                state.categories = categories;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const {
    addToCart,
    clearCart,
    increaseNumber,
    decreaseNumber,
    removeItem,
    search,
    displayAllProducts,
    categorize,
    setCategory,
    addToFavorites,
    removeFromFavorites
} = productSlice.actions;

export default productSlice.reducer;