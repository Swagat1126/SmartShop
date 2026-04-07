import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h3 className="text-lg font-semibold">Admin Panel</h3>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;