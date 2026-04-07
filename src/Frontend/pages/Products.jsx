import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { productAPI } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await productAPI.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product ❌");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>

            <button
              onClick={() => navigate("/admin/add-product")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              + Add Product
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found ❌</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition"
                >
                  {/* IMAGE */}
                  <img
                    src={
                      p.imageUrl || "https://via.placeholder.com/200"
                    }
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  {/* NAME */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {p.name}
                  </h3>

                  {/* PRICE */}
                  <p className="text-xl font-bold text-blue-600 mb-3">
                    ₹{p.price?.toLocaleString() || 0}
                  </p>

                  {/* CATEGORY */}
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Category:</span> {p.category}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Description:</span>{" "}
                    {p.description?.length > 60
                      ? p.description.substring(0, 60) + "..."
                      : p.description || "N/A"}
                  </p>

                  {/* STOCK */}
                  <p className="text-sm text-gray-700 mb-4">
                    <span className="font-semibold">Stock:</span>{" "}
                    <span
                      className={
                        p.stock > 0
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {p.stock > 0 ? `${p.stock} Available` : "Out of Stock"}
                    </span>
                  </p>

                  {/* BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/edit-product/${p.id}`)
                      }
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
