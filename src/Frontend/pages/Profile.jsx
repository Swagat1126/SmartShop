import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { userAPI, orderAPI } from "../services/api";
import { User, Mail, Phone, LogOut, Edit2, Save, X } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const userId = user?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
    });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
        });

        // Get user's orders from API
        const loadOrders = async () => {
            try {
                const userOrders = await orderAPI.getUserOrders(userId);
                setOrders(Array.isArray(userOrders) ? userOrders : []);
            } catch (error) {
                console.log("Using localStorage orders (API unavailable)");
                const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
                const filteredOrders = allOrders.filter((order) => order.email === user.email);
                setOrders(filteredOrders);
            }
        };

        loadOrders();
    }, [userId, navigate]);

    const handleSaveProfile = async () => {
        try {
            // Call API to update profile
            await userAPI.updateProfile(userId, formData);
            alert("Profile updated successfully ✅");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile ❌");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter((o) => o.status === "Pending").length,
            shipped: orders.filter((o) => o.status === "Shipped").length,
            delivered: orders.filter((o) => o.status === "Delivered").length,
        };
        return stats;
    };

    const stats = getOrderStats();

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-gray-600">
                            Manage your account information and orders
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Profile Section */}
                        <div className="md:col-span-2">
                            {/* Profile Card */}
                            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                                <div className="flex justify-between items-center mb-8 pb-6 border-b">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <User className="w-7 h-7 text-blue-600" />
                                        Profile Information
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <>
                                        {/* Edit Form */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 cursor-not-allowed"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={formData.zipCode}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="flex items-center gap-2 flex-1 px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex items-center gap-2 flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* View Profile */}
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold">
                                                    FULL NAME
                                                </p>
                                                <p className="text-gray-800 text-lg font-semibold">
                                                    {formData.name}
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        EMAIL
                                                    </p>
                                                    <p className="text-gray-800 text-lg font-semibold">
                                                        {formData.email}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        PHONE
                                                    </p>
                                                    <p className="text-gray-800 text-lg font-semibold">
                                                        {formData.phone || "Not provided"}
                                                    </p>
                                                </div>
                                            </div>

                                            {formData.address && (
                                                <>
                                                    <div className="border-t pt-6">
                                                        <p className="text-gray-600 text-sm font-semibold mb-3">
                                                            ADDRESS
                                                        </p>
                                                        <p className="text-gray-800 text-lg font-semibold">
                                                            {formData.address}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            {formData.city}, {formData.state}{" "}
                                                            {formData.zipCode}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Recent Orders */}
                            {orders.length > 0 && (
                                <div className="bg-white rounded-lg shadow-lg p-8">
                                    <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {orders.slice(-5).reverse().map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 transition"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        Order #{order.id}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                    <span className="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate("/my-orders")}
                                        className="w-full mt-4 px-6 py-3 border border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50 transition"
                                    >
                                        View All Orders
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Order Stats */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded">
                                        <p className="text-gray-600 text-sm font-semibold">
                                            TOTAL ORDERS
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {stats.total}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded">
                                        <p className="text-gray-600 text-sm font-semibold">
                                            PENDING
                                        </p>
                                        <p className="text-3xl font-bold text-yellow-600">
                                            {stats.pending}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded">
                                        <p className="text-gray-600 text-sm font-semibold">
                                            SHIPPED
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {stats.shipped}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded">
                                        <p className="text-gray-600 text-sm font-semibold">
                                            DELIVERED
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {stats.delivered}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-xl font-bold mb-6 text-red-600">
                                    Danger Zone
                                </h3>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-xl font-bold mb-4">Quick Links</h3>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => navigate("/my-orders")}
                                        className="w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded transition"
                                    >
                                        📦 My Orders
                                    </button>

                                    <button
                                        onClick={() => navigate("/wishlist")}
                                        className="w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded transition"
                                    >
                                        ❤️ Wishlist
                                    </button>

                                    <button
                                        onClick={() => navigate("/")}
                                        className="w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded transition"
                                    >
                                        🛍️ Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
