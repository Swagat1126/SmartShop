import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch products
  const loadProducts = () => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Delete product
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/delete-product/${id}`)
      .then(() => loadProducts())
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f4f4f5" }}>
        
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Products</h2>

          <button
            onClick={() => navigate("/admin/add-product")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p>No products found ❌</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "15px",
                  background: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                {/* IMAGE */}
                <img
                  src={
                    p.image
                      ? `http://localhost:5000/uploads/${p.image}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />

                {/* NAME */}
                <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>
                  {p.name}
                </h3>

                {/* PRICE */}
                <p style={{ color: "#2563eb", fontWeight: "bold" }}>
                  ₹{p.price}
                </p>

                {/* CATEGORY */}
                <p style={{ fontSize: "14px", margin: "4px 0" }}>
                  <b>Category:</b> {p.category}
                </p>

                {/* DESCRIPTION */}
                <p style={{ fontSize: "13px", color: "#555", margin: "4px 0" }}>
                  <b>Description:</b>{" "}
                  {p.description?.length > 60
                    ? p.description.substring(0, 60) + "..."
                    : p.description}
                </p>

                {/* STOCK */}
                <p style={{ fontSize: "14px", margin: "4px 0" }}>
                  <b>Stock:</b>{" "}
                  <span
                    style={{
                      color: p.stock > 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {p.stock > 0 ? `${p.stock} Available` : "Out of Stock"}
                  </span>
                </p>

                {/* BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-product/${p.id}`)
                    }
                    style={{
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
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
  );
};

export default Products;
