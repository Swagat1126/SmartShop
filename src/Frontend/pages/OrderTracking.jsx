import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Package, Truck, CheckCircle } from "lucide-react";

const OrderTracking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const state = location.state;
        if (state?.order) {
            setOrder(state.order);
            setCurrentStage(getStageIndex(state.order.status));
        } else {
            // Try to get from API or localStorage
            const loadLatestOrder = async () => {
                try {
                    const orders = await orderAPI.getUserOrders();
                    if (orders && orders.length > 0) {
                        const lastOrder = orders[orders.length - 1];
                        setOrder(lastOrder);
                        setCurrentStage(getStageIndex(lastOrder.status));
                    }
                } catch (error) {
                    console.log("Using localStorage fallback");
                    const orders = JSON.parse(localStorage.getItem("orders")) || [];
                    if (orders.length > 0) {
                        const lastOrder = orders[orders.length - 1];
                        setOrder(lastOrder);
                        setCurrentStage(getStageIndex(lastOrder.status));
                    }
                }
            };
            loadLatestOrder();
        }
    }, [location]);

    const getStageIndex = (status) => {
        const stageMap = {
            "Pending": 0,
            "Processing": 1,
            "Shipped": 2,
            "Out for Delivery": 3,
            "Delivered": 4,
            "Cancelled": -1,
        };
        return stageMap[status] || 0;
    };

    const getStageIcon = (index, isActive) => {
        const icons = [Package, Package, Truck, Truck, CheckCircle];
        const Icon = icons[index] || Package;
        return (
            <Icon
                className={`w-6 h-6 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                }`}
            />
        );
    };

    if (!order) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="py-20 px-4 text-center">
                    <p className="text-gray-600">Loading order tracking information...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
                        <p className="text-gray-600">
                            Track the status of your order #{order.id}
                        </p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
                        <div className="grid md:grid-cols-4 gap-6 mb-8 pb-8 border-b">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Order ID
                                </p>
                                <p className="text-2xl font-bold text-gray-800">#{order.id}</p>
                            </div>

                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Order Date
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {new Date(order.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Total Amount
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Status
                                </p>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    Delivery Address
                                </h3>
                                <p className="text-gray-700">{order.address}</p>
                                <p className="text-gray-700">
                                    {order.city}, {order.state} {order.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-8">Tracking Timeline</h2>

                        <div className="space-y-6">
                            {order.trackingUpdates?.map((update, index) => (
                                <div key={index} className="flex gap-6">
                                    {/* Timeline point */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                                index <= currentStage
                                                    ? "bg-blue-100 border-blue-600"
                                                    : "bg-gray-100 border-gray-300"
                                            }`}
                                        >
                                            {index < currentStage ? (
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            ) : (
                                                getStageIcon(index, index <= currentStage)
                                            )}
                                        </div>

                                        {index < order.trackingUpdates.length - 1 && (
                                            <div
                                                className={`w-1 h-16 my-2 ${
                                                    index < currentStage
                                                        ? "bg-blue-600"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                        )}
                                    </div>

                                    {/* Timeline content */}
                                    <div className="flex-1 pt-2">
                                        <h3
                                            className={`text-lg font-bold mb-1 ${
                                                index <= currentStage
                                                    ? "text-gray-800"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {update.stage}
                                        </h3>

                                        <div
                                            className={`flex flex-wrap gap-4 text-sm ${
                                                index <= currentStage
                                                    ? "text-gray-600"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {update.date}
                                            </span>
                                            <span>{update.time}</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {update.location}
                                            </span>
                                        </div>

                                        <p
                                            className={`mt-2 ${
                                                index <= currentStage
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {update.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
                        <h2 className="text-2xl font-bold mb-6">Order Items</h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center py-4 border-b"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total:</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex gap-4">
                        <button
                            onClick={() => navigate("/my-orders")}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                        >
                            Back to My Orders
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderTracking;
