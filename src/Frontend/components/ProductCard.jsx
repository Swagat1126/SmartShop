import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "../context/AuthContext";
import { cartAPI, wishlistAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ item }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;
    const [showDetails, setShowDetails] = useState(false);
    
    // --- NEW: State to track if heart should be red ---
    const [isFavorite, setIsFavorite] = useState(false);

    // --- NEW: Check if item is in wishlist on component load ---
    useEffect(() => {
        const wishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
        const userWishlist = user ? wishlists[user.email] || [] : [];
        const exists = userWishlist.some((w) => w.id === item.id);
        setIsFavorite(exists);
    }, [user, item.id]);

    const handleAddToCart = async () => {
        if (!user || !userId) {
            alert("Please login first 🔐");
            navigate("/login");
            return;
        }

        try {
            await cartAPI.addToCart(userId, {
                productId: item.id,
                quantity: 1,
            });
            alert("Added to cart ✅");
        } catch (error) {
            console.log("Using localStorage fallback");
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find((c) => c.id === item.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            // Trigger Navbar update
            window.dispatchEvent(new Event("storage"));
            alert("Added to cart ✅");
        }
    };

    const handleAddToWishlist = async () => {
        if (!user || !userId) {
            alert("Please login first 🔐");
            navigate("/login");
            return;
        }

        try {
            await wishlistAPI.addToWishlist(userId, {
                productId: item.id,
                productName: item.title,
                productPrice: item.price,
                productImage: item.thumbnail,
            });
            setIsFavorite(true); // Turn heart red
            alert("Added to wishlist ❤️");
        } catch (error) {
            console.log("Using localStorage fallback");
            const wishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
            const userWishlist = wishlists[user.email] || [];

            const existingItem = userWishlist.find((w) => w.id === item.id);

            if (existingItem) {
                // If it exists, we remove it (toggle behavior)
                const updatedList = userWishlist.filter((w) => w.id !== item.id);
                wishlists[user.email] = updatedList;
                localStorage.setItem("wishlists", JSON.stringify(wishlists));
                setIsFavorite(false); // Turn heart back to white
                alert("Removed from wishlist 🤍");
                return;
            }

            userWishlist.push(item);
            wishlists[user.email] = userWishlist;
            localStorage.setItem("wishlists", JSON.stringify(wishlists));
            setIsFavorite(true); // Turn heart red
            window.dispatchEvent(new Event("storage")); // Update Navbar
            alert("Added to wishlist ❤️");
        }
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow cursor-pointer relative"
            onClick={() => setShowDetails(true)}
        >
            <div className="relative">
                <motion.img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-40 object-cover mb-3 rounded"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />
                
                {/* --- UPDATED HEART BUTTON --- */}
                <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist();
                    }}
                    className={`absolute top-2 right-2 text-2xl rounded-full p-1 shadow-md transition-colors ${
                        isFavorite ? "bg-red-50" : "bg-white"
                    }`}
                    title="Add to Wishlist"
                >
                    {isFavorite ? "❤️" : "🤍"}
                </motion.button>
            </div>

            <h4 className="font-medium truncate">{item.title}</h4>

            <div className="flex items-center gap-2">
                <p className="text-red-500 font-semibold">₹{item.price}</p>
                {item.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">₹{item.originalPrice}</p>
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                }}
                className="mt-3 w-full bg-black text-white py-2 rounded font-bold uppercase text-xs tracking-widest"
            >
                Add To Cart
            </motion.button>
        </motion.div>

        {/* Modal remains the same... */}
        <AnimatePresence>
            {showDetails && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowDetails(false)}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="bg-white w-full max-w-xl rounded-xl shadow-2xl p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full md:w-48 h-48 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-gray-900 uppercase leading-tight mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-red-600 font-bold text-xl mb-4">₹{item.price}</p>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    {item.description || "Premium quality product selected for Super Shop customers."}
                                </p>
                                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => {
                                    handleAddToCart();
                                    setShowDetails(false);
                                }}
                                className="flex-1 bg-black text-white py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition-colors"
                            >
                                Add To Cart
                            </button>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="flex-1 border-2 border-gray-200 text-gray-800 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default ProductCard;