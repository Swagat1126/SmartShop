import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { orderAPI } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders();
      console.log("Orders:", response);
      setOrders(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🚀 STATUS UPDATE FUNCTION
  const updateStatus = async (id, status) => {
    try {
      console.log("Updating:", id, status);

      // 🔥 Optimistic UI update (instant change)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: status } : o
        )
      );

      await orderAPI.updateOrderStatus(id, status);
      console.log("Order status updated successfully");

    } catch (err) {
      console.error("Error updating status:", err);
      loadOrders();
      alert("Error updating order status ❌");
    }
  };

  const statusOptions = [
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Orders</h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders found ❌</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{o.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{o.userId || "N/A"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{o.totalAmount?.toLocaleString() || 0}
                      </td>

                      {/* STATUS DROPDOWN */}
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) =>
                            updateStatus(o.id, e.target.value)
                          }
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {o.createdAt 
                          ? new Date(o.createdAt).toLocaleDateString()
                          : "N/A"
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
