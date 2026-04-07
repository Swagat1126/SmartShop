import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { wishlistAPI, cartAPI } from "../services/api";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";

const Wishlist = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const userId = user?.id;

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        // Get wishlist from API
        const loadWishlist = async () => {
            try {
                const wishlist = await wishlistAPI.getWishlist(userId);
                setWishlistItems(Array.isArray(wishlist.items) ? wishlist.items : []);
            } catch (error) {
                console.log("Using localStorage wishlist (API unavailable)");
                const wishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
                const userWishlist = wishlists[user.email] || [];
                setWishlistItems(userWishlist);
            }
        };

        loadWishlist();
    }, [userId, navigate]);

    const removeFromWishlist = async (itemId) => {
        try {
            await wishlistAPI.removeFromWishlist(userId, itemId);
            const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId);
            setWishlistItems(updatedWishlist);
        } catch (error) {
            console.log("Falling back to localStorage");
            const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId);
            setWishlistItems(updatedWishlist);
            const wishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
            wishlists[user.email] = updatedWishlist;
            localStorage.setItem("wishlists", JSON.stringify(wishlists));
        }
    };

    const addToCart = async (item) => {
        const productId = item.id || item.productId;
        const productName = item.name || item.productName || item.title;
        try {
            await cartAPI.addToCart(userId, {
                productId: productId,
                quantity: 1,
            });
            alert(`₹{productName || "Item"} added to cart ✅`);
        } catch (error) {
            console.log("Using localStorage fallback");
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find((c) => c.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, id: productId, quantity: 1 });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`₹{productName || "Item"} added to cart ✅`);
        }
    };

    const moveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id || item.productId);
    };

    const calculateTotal = () => {
        return wishlistItems
            .reduce((total, item) => total + (item.price ?? item.productPrice ?? 0), 0)
            .toFixed(2);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                            <p className="text-gray-600">
                                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </button>
                    </div>

                    {wishlistItems.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Add items to your wishlist to save them for later
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Wishlist Items */}
                            <div className="md:col-span-2">
                                <div className="space-y-4">
                                    {wishlistItems.map((item) => {
                                        const imageUrl = item.image || item.productImage || item.thumbnail || item.imageUrl;
                                        const name = item.name || item.productName || item.title;
                                        const price = item.price ?? item.productPrice;
                                        const category = item.category || item.productCategory;
                                        const itemId = item.id || item.productId;

                                        return (
                                            <div
                                                key={itemId}
                                                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex gap-6"
                                            >
                                                {/* Item Image */}
                                                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl">📦</span>
                                                    )}
                                                </div>

                                                {/* Item Details */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        {name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-3">{category}</p>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-2xl font-bold text-green-600">
                                                                ₹{(price ?? 0).toFixed(2)}
                                                            </p>
                                                            {item.originalPrice && (
                                                                <p className="text-sm text-gray-500 line-through">
                                                                    ₹{item.originalPrice?.toFixed(2)}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => moveToCart(item)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                                Add to Cart
                                                            </button>

                                                            <button
                                                                onClick={() => removeFromWishlist(itemId)}
                                                                className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded font-semibold hover:bg-red-50 transition"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="h-fit">
                                <div className="bg-white rounded-lg shadow p-8 sticky top-4">
                                    <h3 className="text-2xl font-bold mb-6">Summary</h3>

                                    <div className="mb-6 pb-6 border-b">
                                        <p className="text-gray-600 mb-2">Total items:</p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            {wishlistItems.length}
                                        </p>
                                    </div>

                                    <div className="mb-6 pb-6 border-b">
                                        <p className="text-gray-600 text-sm mb-2">
                                            Total estimated value:
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            ₹{calculateTotal()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            // Add all items to cart
                                            wishlistItems.forEach((item) => addToCart(item));
                                            setWishlistItems([]);
                                            const wishlists = JSON.parse(
                                                localStorage.getItem("wishlists")
                                            ) || {};
                                            wishlists[user.email] = [];
                                            localStorage.setItem(
                                                "wishlists",
                                                JSON.stringify(wishlists)
                                            );
                                        }}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition mb-3"
                                    >
                                        Add All to Cart
                                    </button>

                                    <button
                                        onClick={() => navigate("/")}
                                        className="w-full px-6 py-3 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>

                                {/* Info Card */}
                                <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        <strong>💡 Tip:</strong> Save items you love in your wishlist. We'll notify you
                                        when they go on sale!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Wishlist;
