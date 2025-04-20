import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayProduct from '../components/DisplayProduct';
import ProductsPage from '../components/ProductsPage';
import FavoritesPage from '../components/FavoritesPage';
import ProductGrid from '../components/ProductGrid';
import CheckoutPage from '../components/CheckOut';
import OrderSuccessPage from '../components/OrderSuccess';

const RouterConfig = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductGrid />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<DisplayProduct />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
    );
};

export default RouterConfig;