import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",   // ✅ ADDED
    description: "",
    image: null,
  });

  // Fetch product data
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          price: res.data.price,
          stock: res.data.stock || "",
          category: res.data.category || "",  // ✅ ADDED
          description: res.data.description || "",
          image: null,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", Number(formData.price));
    data.append("stock", Number(formData.stock));
    data.append("category", formData.category); // ✅ FIX HERE
    data.append("description", formData.description);

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
          alert("Product Updated Successfully ✅");
          navigate("/admin/products");
        } else {
          alert("Update Failed ❌");
        }
      })
      .catch((err) => {
        console.log(err.response?.data);
        alert("Server Error ❌");
      });
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          {/* STOCK */}
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            required
          />

          {/* CATEGORY ✅ NEW */}
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
          />

          {/* IMAGE */}
          <input type="file" name="image" onChange={handleChange} />

          {/* SUBMIT */}
          <button type="submit">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
