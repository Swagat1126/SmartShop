import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Frontend/context/AuthContext";
import ErrorBoundary from "./ErrorBoundary";

// User Pages
import Login from "./Frontend/pages/Login";
import Signup from "./Frontend/pages/Signup";
import Landing from "./Frontend/pages/Landing";
import CategoryPage from "./Frontend/pages/CategoryPage";
import About from "./Frontend/pages/About";
import Contact from "./Frontend/pages/Contact";
import Cart from "./Frontend/pages/Cart";
import Checkout from "./Frontend/pages/Checkout";
import OrderSuccess from "./Frontend/pages/OrderSuccess";
import MyOrders from "./Frontend/pages/MyOrders";
import OrderTracking from "./Frontend/pages/OrderTracking";
import Profile from "./Frontend/pages/Profile";
import Wishlist from "./Frontend/pages/Wishlist";

// Admin Pages
import AdminLogin from "./Frontend/pages/AdminLogin";
import Dashboard from "./Frontend/pages/Dashboard";
import Products from "./Frontend/pages/Products";
import AddProduct from "./Frontend/pages/AddProduct";
import EditProduct from "./Frontend/pages/EditProduct";
import Orders from "./Frontend/pages/Orders";

// ChatBot
import ChatBot from "./Frontend/components/ChatBot/ChatBot";

// Protected Route Component
const ProtectedRoute = ({ element, requiredAdmin = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return element;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* User Protected Routes */}
      <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
      <Route path="/order-success" element={<ProtectedRoute element={<OrderSuccess />} />} />
      <Route path="/my-orders" element={<ProtectedRoute element={<MyOrders />} />} />
      <Route path="/order-tracking" element={<ProtectedRoute element={<OrderTracking />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/wishlist" element={<ProtectedRoute element={<Wishlist />} />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={<ProtectedRoute element={<Dashboard />} requiredAdmin={true} />} 
      />
      <Route 
        path="/admin/products" 
        element={<ProtectedRoute element={<Products />} requiredAdmin={true} />} 
      />
      <Route 
        path="/admin/add-product" 
        element={<ProtectedRoute element={<AddProduct />} requiredAdmin={true} />} 
      />
      <Route 
        path="/admin/edit-product/:id" 
        element={<ProtectedRoute element={<EditProduct />} requiredAdmin={true} />} 
      />
      <Route 
        path="/admin/orders" 
        element={<ProtectedRoute element={<Orders />} requiredAdmin={true} />} 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div>
          <AppRoutes />
          <ChatBot />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;