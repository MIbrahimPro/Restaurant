import React from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import Cart from "./pages/Cart";
import AddressSelection from "./pages/AddressSelection";
import PaymentPage from "./pages/Payment";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminItems from "./pages/admin/AdminItems";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGeneral from "./pages/admin/AdminGeneral";

import RequireAdmin from "./components/RequireAdmin";




function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout/address" element={<AddressSelection />} />
                    <Route path="/checkout/payment" element={<PaymentPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />


                    <Route path="/admin" element={<RequireAdmin> <AdminDashboard /> </RequireAdmin>} />
                    <Route path="/admin/categories" element={<RequireAdmin> <AdminCategories /> </RequireAdmin>} />
                    <Route path="/admin/items" element={<RequireAdmin> <AdminItems /> </RequireAdmin>} />
                    <Route path="/admin/orders" element={<RequireAdmin> <AdminOrders /> </RequireAdmin>} />
                    <Route path="/admin/users" element={<RequireAdmin> <AdminUsers /> </RequireAdmin>} />
                    <Route path="/admin/general" element={<RequireAdmin> <AdminGeneral /> </RequireAdmin>} />

                    <Route path="*" element={<h2 className="text-center mt-5">404 - Not Found</h2>} />


                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;
