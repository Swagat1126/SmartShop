import { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const ExploreSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleToggle = () => {
        if (showAll) {
            // Smoothly scroll back to the section title when minimizing
            sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setShowAll(!showAll);
    };

    // Show 8 products initially, 16 when "View All" is clicked
    const visibleProducts = showAll ? products.slice(0, 16) : products.slice(0, 8);

    return (
        <section ref={sectionRef} className="max-w-7xl mx-auto px-6 md:px-10 py-16 scroll-mt-28">
            {/* Header with Brand Pillar */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                    Explore Our Products
                </h2>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-full text-center py-10 font-bold italic">Gathering products...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center">No products found.</p>
                ) : (
                    visibleProducts.map((item) => (
                        <ProductCard
                            key={item.id}
                            item={{
                                id: item.id,
                                title: item.name,
                                price: item.price,
                                thumbnail: item.imageUrl,
                                description: item.description,
                                category: item.category,
                            }}
                        />
                    ))
                )}
            </div>

            {/* --- PREMIUM TOGGLE BUTTON --- */}
            {!loading && products.length > 8 && (
                <div className="mt-16 text-center">
                    <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0px 15px 30px rgba(220, 38, 38, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggle}
                        className="inline-flex items-center gap-3 bg-red-600 text-white px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-100 hover:bg-black transition-all duration-500"
                    >
                        {showAll ? (
                            <>Show Less <ChevronUp size={18} /></>
                        ) : (
                            <>Explore All Products <ChevronDown size={18} /></>
                        )}
                    </motion.button>
                </div>
            )}
        </section>
    );
};

export default ExploreSection;