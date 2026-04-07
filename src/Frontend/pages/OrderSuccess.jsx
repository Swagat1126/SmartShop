import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderAPI } from "../services/api";
import { CheckCircle, Download, MapPin, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);

    const resolveOrderItems = (orderData) => {
        if (Array.isArray(orderData?.items)) return orderData.items;
        if (Array.isArray(orderData?.orderItems)) return orderData.orderItems;
        return [];
    };

    const getOrderTotal = (orderData) => {
        return orderData?.totalAmount ?? orderData?.total ?? 0;
    };

    const getOrderDate = (orderData) => {
        return orderData?.createdAt || orderData?.date;
    };

    useEffect(() => {
        const state = location.state;
        if (state?.order) {
            setOrder(state.order);
        } else {
            // Fallback: try to get the latest order from API or localStorage
            const loadLatestOrder = async () => {
                try {
                    if (!user?.id) {
                        throw new Error("Missing user id");
                    }
                    const orders = await orderAPI.getUserOrders(user.id);
                    if (orders && orders.length > 0) {
                        setOrder(orders[orders.length - 1]);
                    }
                } catch (error) {
                    console.log("Using localStorage fallback");
                    const orders = JSON.parse(localStorage.getItem("orders")) || [];
                    if (orders.length > 0) {
                        setOrder(orders[orders.length - 1]);
                    }
                }
            };
            loadLatestOrder();
        }
    }, [location, user]);

    const downloadInvoice = () => {
        if (!order) return;
        const orderItems = resolveOrderItems(order);
        const totalAmount = getOrderTotal(order);
        const orderDate = getOrderDate(order);

        const invoiceContent = `
INVOICE - SmartShop
===================================
Order ID: ${order.id}
    Date: ${orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"}

Customer Information:
    ${order.customer || user?.name || "N/A"}
    ${order.email || user?.email || "N/A"}
    ${order.phone || user?.phone || "N/A"}

Delivery Address:
    ${order.address || "N/A"}
    ${order.city || ""} ${order.state || ""} ${order.zipCode || ""}

Items Ordered:
    ${orderItems.map((item) => `- ${item.name || item.productName || item.productId} x${item.quantity}: $${((item.price || 0) * item.quantity).toFixed(2)}`).join("\n")}

    Subtotal: $${orderItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)}
    Shipping: ${totalAmount > 500 ? "FREE" : "$50.00"}
    Tax (10%): $${(orderItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) * 0.1).toFixed(2)}
    Total: $${totalAmount.toFixed(2)}

Status: ${order.status}
===================================
        `;

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(invoiceContent)
        );
        element.setAttribute("download", `invoice-${order.id}.txt`);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (!order) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="py-20 px-4 text-center">
                    <p className="text-gray-600">Loading order details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-3xl mx-auto">
                    {/* Success Icon and Message */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Order Confirmed!
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        {/* Order ID and Date */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Order Number
                                </p>
                                <p className="text-2xl font-bold text-gray-800">#{order.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm font-semibold uppercase">
                                    Order Date
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {getOrderDate(order)
                                        ? new Date(getOrderDate(order)).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="text-blue-600">👤</span> Customer Details
                                </h3>
                                <p className="text-gray-700 font-semibold">{order.customer || user?.name || "N/A"}</p>
                                <p className="text-gray-600">{order.email || user?.email || "N/A"}</p>
                                <p className="text-gray-600">{order.phone || user?.phone || "N/A"}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" /> Delivery Address
                                </h3>
                                <p className="text-gray-700">{order.address || "N/A"}</p>
                                <p className="text-gray-700">
                                    {order.city || ""} {order.state || ""} {order.zipCode || ""}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8 pb-8 border-b">
                            <h3 className="font-semibold text-gray-800 mb-4">Items Ordered</h3>
                            <div className="space-y-3">
                                {resolveOrderItems(order).map((item) => (
                                    <div
                                        key={item.id || item.productId}
                                        className="flex justify-between items-center py-3 border-b"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.name || item.productName || item.productId}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-800">
                                            ${((item.price || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="mb-8 space-y-2">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal:</span>
                                <span>
                                    ${resolveOrderItems(order)
                                        .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
                                        .toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping:</span>
                                <span>
                                    {getOrderTotal(order) > 500
                                        ? "FREE"
                                        : "$50.00"}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax (10%):</span>
                                <span>
                                    ${(
                                        resolveOrderItems(order).reduce(
                                            (sum, item) => sum + (item.price || 0) * item.quantity,
                                            0
                                        ) * 0.1
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-4">
                                <span>Total Amount:</span>
                                <span className="text-green-600">${getOrderTotal(order).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-8">
                            <p className="text-sm text-blue-600 font-semibold uppercase">Status</p>
                            <p className="text-gray-800 font-semibold text-lg">{order.status}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                We'll send you an email when your order is shipped
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={downloadInvoice}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            >
                                <Download className="w-5 h-5" />
                                Download Invoice
                            </button>

                            <button
                                onClick={() => navigate("/my-orders")}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
                            >
                                View My Orders
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <p className="text-3xl mb-2">📧</p>
                            <h4 className="font-semibold text-gray-800 mb-2">Confirmation Email</h4>
                            <p className="text-sm text-gray-600">
                                Check your email for order confirmation
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <p className="text-3xl mb-2">🚚</p>
                            <h4 className="font-semibold text-gray-800 mb-2">Fast Delivery</h4>
                            <p className="text-sm text-gray-600">
                                Expected delivery in 3-5 business days
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <p className="text-3xl mb-2">📱</p>
                            <h4 className="font-semibold text-gray-800 mb-2">Track Order</h4>
                            <p className="text-sm text-gray-600">
                                Monitor your order status anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderSuccess;
