import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="main">
        <AdminNavbar />

        <div className="dashboard-container">
          <h2 className="title">Dashboard Overview</h2>

          <div className="card-grid">
            <div className="card card-blue">
              <h3>Total Products</h3>
              <p>120</p>
            </div>

            <div className="card card-green">
              <h3>Total Orders</h3>
              <p>45</p>
            </div>

            <div className="card card-purple">
              <h3>Revenue</h3>
              <p>₹50,000</p>
            </div>

            {/* ⭐ NEW STOCK CARD */}
            <div
              className="card card-orange"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/stock")}
            >
              <h3>Stock Management</h3>
              <p>Manage Inventory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
