import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const unwrap = (promise) => promise.then((response) => response.data);

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth Endpoints
export const authAPI = {
    register: (userData) => unwrap(api.post("/auth/register", userData)),
    login: (credentials) => unwrap(api.post("/auth/login", credentials)),
    adminLogin: (credentials) => unwrap(api.post("/admin/login", credentials)),
};

// User Endpoints
export const userAPI = {
    getProfile: (userId) => unwrap(api.get(`/users/${userId}`)),
    updateProfile: (userId, data) => unwrap(api.put(`/users/${userId}`, data)),
};

// Product Endpoints
export const productAPI = {
    getAllProducts: () => unwrap(api.get("/products")),
    getProductById: (id) => unwrap(api.get(`/products/${id}`)),
    getByCategory: (category) => unwrap(api.get(`/products/category/${category}`)),
    searchProducts: (query) => unwrap(api.get(`/products/search?name=${query}`)),
    addProduct: (data) => unwrap(api.post("/products", data)),
    updateProduct: (id, data) => unwrap(api.put(`/products/${id}`, data)),
    deleteProduct: (id) => unwrap(api.delete(`/products/${id}`)),
};

// Cart Endpoints
export const cartAPI = {
    getCart: (userId) => unwrap(api.get(`/cart/${userId}`)),
    addToCart: (userId, item) => unwrap(api.post(`/cart/${userId}/add`, item)),
    removeFromCart: (userId, itemId) => unwrap(api.delete(`/cart/${userId}/remove/${itemId}`)),
    updateCartItem: (userId, itemId, quantity) => 
        unwrap(api.put(`/cart/${userId}/update/${itemId}`, { quantity })),
    clearCart: (userId) => unwrap(api.delete(`/cart/${userId}/clear`)),
};

// Order Endpoints
export const orderAPI = {
    getAllOrders: () => unwrap(api.get("/orders")),
    getUserOrders: (userId) => unwrap(api.get(`/orders/${userId}`)),
    getOrderById: (id) => unwrap(api.get(`/orders/${id}`)),
    placeOrder: (userId, orderData) => unwrap(api.post(`/orders/${userId}`, orderData)),
    updateOrderStatus: (id, status) => unwrap(api.put(`/orders/${id}/status`, { status })),
};

// Wishlist Endpoints
export const wishlistAPI = {
    getWishlist: (userId) => unwrap(api.get(`/wishlist/${userId}`)),
    addToWishlist: (userId, productId) => unwrap(api.post(`/wishlist/${userId}/add`, { productId })),
    removeFromWishlist: (userId, productId) => unwrap(api.delete(`/wishlist/${userId}/remove/${productId}`)),
    clearWishlist: (userId) => unwrap(api.delete(`/wishlist/${userId}/clear`)),
};

// Admin Endpoints
export const adminAPI = {
    getAllOrders: () => unwrap(api.get("/admin/orders")),
    getAllProducts: () => unwrap(api.get("/admin/products")),
    getDashboardStats: () => unwrap(api.get("/admin/dashboard")),
};

export default api;
