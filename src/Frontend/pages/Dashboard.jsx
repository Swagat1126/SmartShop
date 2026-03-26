import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main">
        <AdminNavbar />
        <h2>Dashboard</h2>

        <div className="cards">
          <div>Total Products: 120</div>
          <div>Total Orders: 45</div>
          <div>Revenue: ₹50,000</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;