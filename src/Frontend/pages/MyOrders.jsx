import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { orderAPI } from "../services/api";
import { Package, Eye, Download, Truck } from "lucide-react";

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const userId = user?.id;

    const resolveOrderItems = (order) => {
        if (Array.isArray(order?.items)) return order.items;
        if (Array.isArray(order?.orderItems)) return order.orderItems;
        return [];
    };

    const getOrderTotal = (order) => {
        return order?.totalAmount ?? order?.total ?? 0;
    };

    const getOrderDate = (order) => {
        return order?.createdAt || order?.date;
    };

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        // Fetch user orders from API
        const loadOrders = async () => {
            try {
                const userOrders = await orderAPI.getUserOrders(userId);
                setOrders(Array.isArray(userOrders) ? userOrders : []);
            } catch (error) {
                console.log("Using localStorage orders (API unavailable)");
                // Fallback to localStorage for fake data
                const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
                const filteredOrders = allOrders.filter((order) => order.email === user.email);
                setOrders(filteredOrders);
            }
        };

        loadOrders();
    }, [userId, navigate]);

    const filteredOrders =
        filterStatus === "All"
            ? orders
            : orders.filter((order) => order.status === filterStatus);

    const downloadInvoice = (order) => {
        const orderItems = resolveOrderItems(order);
        const totalAmount = getOrderTotal(order);
        const orderDate = getOrderDate(order);
        const invoiceContent = `
INVOICE - SmartShop
===================================
Order ID: ${order.id}
    Date: ${orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"}

Customer Information:
${order.customer}
${order.email}
${order.phone}

Delivery Address:
${order.address}
${order.city}, ${order.state} ${order.zipCode}

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

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Processing":
                return "bg-blue-100 text-blue-800";
            case "Shipped":
                return "bg-purple-100 text-purple-800";
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
                        <p className="text-gray-600">
                            Track and manage all your orders
                        </p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                No orders yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You haven't placed any orders yet. Start shopping!
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Filter Buttons */}
                            <div className="mb-8 flex flex-wrap gap-2">
                                {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-2 rounded font-semibold transition ${
                                                filterStatus === status
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Orders List */}
                            <div className="space-y-6">
                                {filteredOrders.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow p-12 text-center">
                                        <p className="text-gray-600 text-lg">
                                            No orders with status "{filterStatus}"
                                        </p>
                                    </div>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                                        >
                                            <div className="p-6">
                                                {/* Order Header */}
                                                <div className="grid md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                                                    <div>
                                                        <p className="text-gray-600 text-sm font-semibold">
                                                            Order ID
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            #{order.id}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-sm font-semibold">
                                                            Order Date
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {getOrderDate(order)
                                                                ? new Date(getOrderDate(order)).toLocaleDateString()
                                                                : "N/A"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-sm font-semibold">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-lg font-bold text-green-600">
                                                            ${getOrderTotal(order).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-sm font-semibold">
                                                            Status
                                                        </p>
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="mb-6">
                                                    <h4 className="font-semibold text-gray-800 mb-3">
                                                        Items ({resolveOrderItems(order).length})
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {resolveOrderItems(order).slice(0, 2).map((item) => (
                                                            <div
                                                                key={item.id || item.productId}
                                                                className="flex justify-between text-gray-700"
                                                            >
                                                                <span>
                                                                    {(item.name || item.productName || item.productId)} x{item.quantity}
                                                                </span>
                                                                <span>
                                                                    ${(
                                                                        (item.price || 0) *
                                                                        item.quantity
                                                                    ).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {resolveOrderItems(order).length > 2 && (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedOrder(order)
                                                                }
                                                                className="text-blue-600 font-semibold hover:underline text-sm"
                                                            >
                                                                +{resolveOrderItems(order).length - 2} more items
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            navigate("/order-tracking", {
                                                                state: { order },
                                                            })
                                                        }
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition"
                                                    >
                                                        <Truck className="w-4 h-4" />
                                                        Track Order
                                                    </button>

                                                    <button
                                                        onClick={() => downloadInvoice(order)}
                                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-50 transition"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                Order #{selectedOrder.id} Details
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Shipping Info */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Shipping Address
                                </h3>
                                <p className="text-gray-700">{selectedOrder.address}</p>
                                <p className="text-gray-700">
                                    {selectedOrder.city}, {selectedOrder.state}{" "}
                                    {selectedOrder.zipCode}
                                </p>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Order Items
                                </h3>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {resolveOrderItems(selectedOrder).map((item) => (
                                        <div
                                            key={item.id || item.productId}
                                            className="flex justify-between py-2 border-b"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.name || item.productName || item.productId}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ${((item.price || 0) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">
                                        $
                                        {resolveOrderItems(selectedOrder)
                                            .reduce(
                                                (sum, item) =>
                                                    sum + (item.price || 0) * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="text-lg font-bold text-green-600">
                                        ${getOrderTotal(selectedOrder).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default MyOrders;
