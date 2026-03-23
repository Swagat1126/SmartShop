import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { phones } from "../data/phones";
import { computers } from "../data/computers";
import { gaming } from "../data/gaming";
import { camera } from "../data/camera";
import { electronics } from "../data/electronics";
import { watch } from "../data/watch";
import { headphones } from "../data/headphones";
import { fashion } from "../data/fashion";

const CategoryPage = () => {
    const { name } = useParams();

    const [search, setSearch] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");

    const categoryMap = {
        phones: phones,
        computers: computers,
        gaming: gaming,
        camera: camera,
        electronics: electronics,
        watch: watch,
        headphones: headphones,
        fashion: fashion
    };

    const data = categoryMap[name?.toLowerCase()] || [];

    const filteredData = data.filter((item) => {
        return (
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            (price === "" || item.price <= price) &&
            (type === "" || item.type === type)
        );
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 via-white to-gray-200 min-h-screen"
        >

            <Navbar />

            <div className="px-10 py-10">

                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-bold mb-6 capitalize"
                >
                    {name} Products
                </motion.h2>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 mb-6"
                >

                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded w-full md:w-1/2"
                    />

                    <select
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border px-4 py-2 rounded"
                    >
                        <option value="">All Prices</option>
                        <option value="5000">Below ₹5000</option>
                        <option value="20000">Below ₹20000</option>
                        <option value="50000">Below ₹50000</option>
                    </select>

                    {name?.toLowerCase() === "phones" && (
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border px-4 py-2 rounded"
                        >
                            <option value="">All</option>
                            <option value="Android">Android</option>
                            <option value="iOS">iOS</option>
                        </select>
                    )}

                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard item={item} />
                            </motion.div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </motion.div>

            </div>

        </motion.div>
    );
};

export default CategoryPage;