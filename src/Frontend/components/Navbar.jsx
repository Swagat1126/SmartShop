import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Search, LogOut, Package, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0); // Added for Wishlist
    const [searchQuery, setSearchQuery] = useState("");
    
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    // Combined function to update counts from LocalStorage
    const updateCounts = () => {
        // Update Cart
        const rawCart = localStorage.getItem("cart");
        const cart = rawCart ? JSON.parse(rawCart) : [];
        setCartCount(Array.isArray(cart) ? cart.length : 0);

        // Update Wishlist (Syncs with the heart buttons)
        const wishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
        const userWishlist = user ? wishlists[user.email] || [] : [];
        setWishlistCount(userWishlist.length);
    };

    useEffect(() => {
        updateCounts();
        // Listen for the 'storage' event we triggered in ProductCard
        window.addEventListener("storage", updateCounts);
        return () => window.removeEventListener("storage", updateCounts);
    }, [user]); // Re-run if user changes (for wishlist sync)

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
    };

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-b-2 border-red-600"
        >
            {/* --- LOGO SECTION --- */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
<img 
  src={logo} 
  alt="Super Shop Logo" 
  className="h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
/>                <h1 className="text-black font-light tracking-tight flex items-baseline select-none">
                    <span className="text-3xl font-black text-red-600">S</span>
                    <span className="text-xl font-bold">Mart</span>
                    <span className="text-3xl font-black text-red-600 ml-0.5">S</span>
                    <span className="text-xl font-bold">hop</span>
                </h1>
            </div>

            {/* --- SEARCH BAR --- */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-grow max-w-md mx-10 relative group">
                <input
                    type="text"
                    placeholder="Search premium products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 border-2 border-transparent rounded-full py-2 px-5 pl-12 text-sm focus:bg-white focus:border-red-500 transition-all outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
            </form>

            {/* --- RIGHT ACTIONS --- */}
            <div className="flex items-center gap-6">
                <div className="hidden xl:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-black">
                    <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
                    <Link to="/contact" className="hover:text-red-600 transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-5 border-l pl-6 border-gray-200">
                    {/* Wishlist with Badge */}
                    <div className="relative cursor-pointer text-black hover:text-red-600 transition-colors" onClick={() => navigate("/wishlist")}>
                        <Heart size={22} strokeWidth={2.5} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                                {wishlistCount}
                            </span>
                        )}
                    </div>

                    {/* Cart with Red Badge */}
                    <div className="relative cursor-pointer text-black hover:text-red-600 transition-colors" onClick={() => navigate("/cart")}>
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </div>

                    {!isLoggedIn ? (
                        <button 
                            className="bg-black text-white px-7 py-2.5 rounded-full text-[10px] font-black tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95"
                            onClick={() => navigate("/login")}
                        >
                            LOGIN
                        </button>
                    ) : (
                        <div className="relative">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black shadow-md border-2 border-white hover:border-red-200 transition-all">
                                    {userInitial}
                                </div>
                                <ChevronDown size={14} className={`text-black transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        className="absolute right-0 mt-4 w-56 bg-white shadow-2xl rounded-2xl p-2 border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                            <p className="text-sm font-black text-black truncate">{user?.name}</p>
                                        </div>
                                        <button onClick={() => {navigate("/profile"); setShowMenu(false)}} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><User size={16}/> Profile</button>
                                        <button onClick={() => {navigate("/my-orders"); setShowMenu(false)}} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Package size={16}/> My Orders</button>
                                        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 mt-2 border-t pt-3 text-xs text-red-600 font-black hover:bg-red-50 rounded-lg transition-colors"><LogOut size={16}/> Logout</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;