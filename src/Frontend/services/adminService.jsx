import axios from "axios";

const API = "http://localhost:8080/api";

// GET products
export const getProducts = () => axios.get(`${API}/products`);

// ADD product
export const addProduct = (data) =>
  axios.post(`${API}/products`, data);

// DELETE product
export const deleteProduct = (id) =>
  axios.delete(`${API}/products/${id}`);

// UPDATE product
export const updateProduct = (id, data) =>
  axios.put(`${API}/products/${id}`, data);

// GET orders
export const getOrders = () =>
  axios.get(`${API}/orders`);