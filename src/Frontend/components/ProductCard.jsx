import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProductCard = ({ item }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAddToCart = () => {
        if (!user) {
            alert("Please login first 🔐");
            navigate("/login");
            return;
        }

        alert("Added to cart ✅");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
        >

            <motion.img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-40 object-cover mb-3 rounded"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
            />

            <h4 className="font-medium">{item.title}</h4>

            <p className="text-red-500 font-semibold">₹{item.price}</p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="mt-3 w-full bg-black text-white py-2 rounded"
            >
                Add To Cart
            </motion.button>

        </motion.div>
    );
};

export default ProductCard;