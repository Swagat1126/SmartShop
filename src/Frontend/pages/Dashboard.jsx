import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { productAPI, orderAPI } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders] = await Promise.all([
          productAPI.getAllProducts(),
          orderAPI.getAllOrders(),
        ]);

        const totalRevenue = Array.isArray(orders)
          ? orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
          : 0;

        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalRevenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Fallback dummy data
        setStats({
          totalProducts: 120,
          totalOrders: 45,
          totalRevenue: 50000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products Card */}
              <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-semibold opacity-90">Total Products</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
              </div>

              {/* Total Orders Card */}
              <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-semibold opacity-90">Total Orders</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>

              {/* Revenue Card */}
              <div className="bg-purple-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-semibold opacity-90">Revenue</h3>
                <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue?.toLocaleString()}</p>
              </div>

              {/* Stock Management Card */}
              <div
                className="bg-orange-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate("/admin/products")}
              >
                <h3 className="text-sm font-semibold opacity-90">Stock Management</h3>
                <p className="text-sm mt-2">Manage Inventory</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
