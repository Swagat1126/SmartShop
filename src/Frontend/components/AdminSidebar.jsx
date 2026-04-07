import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Orders", path: "/admin/orders", icon: "🛒" },
  ];

  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#000", // 🔹 Black background
      color: "#fff",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "30px", fontSize: "22px", textAlign: "center" }}>Admin</h2>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 15px",
            borderRadius: "8px",
            textDecoration: "none",
            color: location.pathname === link.path ? "#000" : "#fff",
            backgroundColor: location.pathname === link.path ? "#fff" : "transparent",
            fontWeight: location.pathname === link.path ? "bold" : "normal",
            transition: "0.2s",
          }}
        >
          <span>{link.icon}</span>
          {link.name}
        </Link>
      ))}
      <div style={{ marginTop: "auto", fontSize: "12px", color: "#ccc", textAlign: "center" }}>
        &copy; 2026 Admin Panel
      </div>
    </div>
  );
};

export default AdminSidebar;