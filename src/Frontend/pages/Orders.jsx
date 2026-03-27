import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");

      console.log("Orders:", res.data);

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🚀 STATUS UPDATE FUNCTION (FIXED)
  const updateStatus = async (id, status) => {
    try {
      console.log("Updating:", id, status);

      // 🔥 Optimistic UI update (instant change)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: status } : o
        )
      );

      const res = await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status }
      );

      console.log("Update response:", res.data);

      if (!res.data.success) {
        alert("Update failed ❌");

        // rollback if failed
        loadOrders();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      loadOrders();
    }
  };

  const statusOptions = [
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "20px", background: "#f4f4f5" }}>
        <h2 style={{ marginBottom: "20px" }}>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found ❌</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px" }}>ID</th>
                <th style={{ padding: "10px" }}>Customer</th>
                <th style={{ padding: "10px" }}>Email</th>
                <th style={{ padding: "10px" }}>Product</th>
                <th style={{ padding: "10px" }}>Qty</th>
                <th style={{ padding: "10px" }}>Total Price</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px" }}>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                >
                  <td style={{ padding: "10px" }}>{o.id}</td>
                  <td style={{ padding: "10px" }}>
                    {o.customer_name}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {o.customer_email}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {o.product_name}
                  </td>
                  <td style={{ padding: "10px" }}>{o.quantity}</td>
                  <td style={{ padding: "10px" }}>
                    ₹{o.total_price}
                  </td>

                  {/* 🚀 STATUS DROPDOWN FIXED */}
                  <td style={{ padding: "10px" }}>
                    <select
                      value={o.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(o.id, e.target.value)
                      }
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: "10px" }}>
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
