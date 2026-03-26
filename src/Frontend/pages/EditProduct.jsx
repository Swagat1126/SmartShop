import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
  });

  // Fetch product
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          price: res.data.price,
          image: null,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", Number(formData.price));

    if (formData.image) {
      data.append("image", formData.image);
    }

    axios
      .put(`http://localhost:5000/api/admin/update-product/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Updated ✅");
          navigate("/admin/products");
        } else {
          alert("Update Failed ❌");
        }
      })
      .catch(() => alert("Server Error ❌"));
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Edit Form</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            style={inputStyle}
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            style={inputStyle}
            required
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            style={fileStyle}
          />

          <button type="submit" style={buttonStyle}>
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

// 🎨 Styles

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f4f5",
};

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  width: "350px",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "20px",
  color: "#2563eb",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#ffffff", // ✅ white
  color: "#000000", // ✅ black text
  fontSize: "14px",
  outline: "none",
};

const fileStyle = {
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default EditProduct;