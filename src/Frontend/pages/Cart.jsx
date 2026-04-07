import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { cartAPI } from "../services/api";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const userId = user?.id;

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        // Load cart from API
        const loadCart = async () => {
            try {
                const cart = await cartAPI.getCart(userId);
                setCartItems(Array.isArray(cart.items) ? cart.items : []);
            } catch (error) {
                console.log("Using localStorage cart (API unavailable)");
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                setCartItems(cart);
            }
        };

        loadCart();
    }, [userId, navigate]);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            removeItem(itemId);
            return;
        }

        try {
            await cartAPI.updateQuantity(userId, itemId, quantity);
            const updatedCart = cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setCartItems(updatedCart);
        } catch (error) {
            console.log("Using localStorage fallback");
            const updatedCart = cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartAPI.removeFromCart(userId, itemId);
            const updatedCart = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCart);
        } catch (error) {
            console.log("Using localStorage fallback");
            const updatedCart = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || item.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 500 ? 0 : 50;
        const tax = (subtotal * 0.1).toFixed(2);
        return (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = (subtotal * 0.1).toFixed(2);
    const total = calculateTotal();

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
                            <p className="text-gray-600">
                                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
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

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Add some products to your cart to get started
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-6 border-b bg-gray-50">
                                        <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-600">
                                            <div>Product</div>
                                            <div className="text-center">Qty</div>
                                            <div className="text-right">Price</div>
                                            <div className="text-right">Total</div>
                                        </div>
                                    </div>

                                    <div className="divide-y">
                                        {cartItems.map((item) => {
                                            const product = item.product || item;
                                            return (
                                                <div key={item.id} className="p-6">
                                                    <div className="grid grid-cols-4 gap-4 items-center">
                                                        {/* Product Info */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                                                                {product.imageUrl || product.thumbnail ? (
                                                                    <img
                                                                        src={product.imageUrl || product.thumbnail}
                                                                        alt={product.name || product.title}
                                                                        className="w-full h-full object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <span className="text-2xl flex items-center justify-center h-full">
                                                                        📦
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800">
                                                                    {product.name || product.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{product.category}</p>
                                                            </div>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(item.id, item.quantity - 1)
                                                                }
                                                                className="p-1 hover:bg-gray-100 rounded"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-6 text-center font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(item.id, item.quantity + 1)
                                                                }
                                                                className="p-1 hover:bg-gray-100 rounded"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Unit Price */}
                                                        <div className="text-right text-gray-700 font-semibold">
                                                            ₹{(product.price || 0).toFixed(2)}
                                                        </div>

                                                        {/* Total & Remove */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-green-600">
                                                                ₹{((product.price || 0) * item.quantity).toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                                title="Remove from cart"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="h-fit">
                                <div className="bg-white rounded-lg shadow p-8 sticky top-4">
                                    <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                                    <div className="space-y-4 mb-6 pb-6 border-b">
                                        <div className="flex justify-between text-gray-700">
                                            <span>Subtotal:</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Shipping:</span>
                                            <span>
                                                {shipping === 0 ? (
                                                    <span className="text-green-600 font-semibold">FREE</span>
                                                ) : (
                                                    `₹${shipping.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Tax (10%):</span>
                                            <span>₹{tax}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xl font-bold mb-6">
                                        <span>Total:</span>
                                        <span className="text-green-600">₹{total}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate("/checkout")}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition mb-3"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <button
                                        onClick={() => navigate("/")}
                                        className="w-full px-6 py-3 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                                    >
                                        Continue Shopping
                                    </button>

                                    {shipping > 0 && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                            💡 Free shipping on orders over ₹500!
                                        </div>
                                    )}
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

export default Cart;
