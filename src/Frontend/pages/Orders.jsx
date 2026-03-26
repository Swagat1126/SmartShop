import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => {
        console.log("Orders:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "20px", background: "#f4f4f5" }}>
        <h2 style={{ marginBottom: "20px" }}>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found ❌</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
            <thead style={{ background: "#fff", color: "#000" }}>
              <tr>
                <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Product</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Qty</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Total Price</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
                  <td style={{ padding: "10px" }}>{o.id}</td>
                  <td style={{ padding: "10px" }}>{o.customer_name}</td>
                  <td style={{ padding: "10px" }}>{o.customer_email}</td>
                  <td style={{ padding: "10px" }}>{o.product_name}</td>
                  <td style={{ padding: "10px" }}>{o.quantity}</td>
                  <td style={{ padding: "10px" }}>₹{o.total_price}</td>
                  <td style={{ padding: "10px" }}>{o.status}</td>
                  <td style={{ padding: "10px" }}>{new Date(o.created_at).toLocaleString()}</td>
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