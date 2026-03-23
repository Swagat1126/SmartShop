import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
    }, []);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center px-10 py-4 bg-white shadow-sm relative"
        >

            <div className="w-1/4">
                <motion.h1
                    whileHover={{ scale: 1.05 }}
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    SmartShop
                </motion.h1>
            </div>

            <div className="w-2/4 flex justify-center gap-8 text-gray-600">
                <Link to="/">Home</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>

                {!isLoggedIn && (
                    <span
                        className="cursor-pointer font-semibold"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                )}
            </div>

            <div className="w-1/4 flex justify-end items-center gap-4 relative">

                {!isLoggedIn ? (
                    <span
                        className="cursor-pointer text-blue-600 font-semibold"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                ) : (
                    <>
                        <motion.span
                            whileHover={{ scale: 1.2 }}
                            className="text-xl cursor-pointer"
                        >
                            ❤️
                        </motion.span>

                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="relative cursor-pointer"
                            onClick={() => navigate("/cart")}
                        >
                            <span className="text-xl">🛒</span>

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </motion.div>

                        <div className="relative">
                            <motion.span
                                whileHover={{ scale: 1.2 }}
                                className="text-xl cursor-pointer"
                                onClick={() => setShowMenu(!showMenu)}
                            >
                                👤
                            </motion.span>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3 z-50"
                                    >

                                        <p className="text-sm font-semibold mb-2">
                                            {user?.name}
                                        </p>

                                        <p
                                            className="cursor-pointer hover:text-blue-500 py-1"
                                            onClick={() => navigate("/profile")}
                                        >
                                            My Account
                                        </p>

                                        <p
                                            className="cursor-pointer hover:text-blue-500 py-1"
                                            onClick={() => navigate("/orders")}
                                        >
                                            My Orders
                                        </p>

                                        <p className="cursor-pointer hover:text-blue-500 py-1">
                                            My Reviews
                                        </p>

                                        <hr className="my-2" />

                                        <p
                                            className="cursor-pointer text-red-500"
                                            onClick={logout}
                                        >
                                            Logout
                                        </p>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>

        </motion.nav>
    );
};

export default Navbar;