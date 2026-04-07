import { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { Timer, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const customCSS = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    background: linear-gradient(to right, #000 20%, #ef4444 40%, #ef4444 60%, #000 80%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 5s linear infinite;
    display: inline-block;
  }
`;

const FlashSaleSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const sectionRef = useRef(null);

    // Timer Logic
    const [secondsLeft, setSecondsLeft] = useState(3600 * 12 + 45 * 60);
    useEffect(() => {
        const timer = setInterval(() => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, []);

    const time = {
        hrs: String(Math.floor(secondsLeft / 3600)).padStart(2, '0'),
        mins: String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0'),
        secs: String(secondsLeft % 60).padStart(2, '0')
    };

    // Fetch Logic (Matching your shared code)
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : [];
                setProducts(list.sort(() => 0.5 - Math.random()));
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = () => {
        if (showAll) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setShowAll(!showAll);
    };

    const visibleProducts = showAll ? products.slice(0, 10) : products.slice(0, 4);

    return (
        <section ref={sectionRef} className="max-w-7xl mx-auto px-6 md:px-10 py-16 scroll-mt-28">
            <style>{customCSS}</style>

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-1 h-10 bg-red-600 rounded-full" />
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                                <Zap className="text-red-600 fill-red-600" size={28} />
                                <span className="animate-shimmer">Flash Sales</span>
                            </h2>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">Limited Time Deals</p>
                    </div>
                </div>

                {/* --- TIMER --- */}
                <div className="flex items-center gap-4 text-black px-2">
                    <Timer size={20} className="text-red-600" />
                    <div className="flex gap-2 font-mono text-3xl font-black tabular-nums">
                        <span>{time.hrs}</span>
                        <span className="text-red-600">:</span>
                        <span>{time.mins}</span>
                        <span className="text-red-600">:</span>
                        <span>{time.secs}</span>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID (Using your ProductCard logic) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-full text-center py-10 font-bold">Loading Deals...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center">No deals found.</p>
                ) : (
                    visibleProducts.map((item) => (
                        <div key={item.id} className="relative transition-transform duration-300 hover:-translate-y-2">
                            {/* Sale Tag Overlay */}
                            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                                SALE
                            </div>

                            <ProductCard
                                item={{
                                    id: item.id,
                                    title: item.name,
                                    // Passing discounted price for Flash Sale
                                    price: Number((item.price * 0.75).toFixed(0)),
                                    originalPrice: item.price,
                                    thumbnail: item.imageUrl,
                                    description: item.description,
                                    category: item.category,
                                }}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* --- RED ROUNDED BUTTON --- */}
            {!loading && products.length > 4 && (
                <div className="mt-16 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(220, 38, 38, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggle}
                        className="inline-flex items-center gap-3 bg-red-600 text-white px-12 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-100 hover:bg-black transition-all duration-500"
                    >
                        {showAll ? <>Show Less <ChevronUp size={16} /></> : <>View All Deals <ChevronDown size={16} /></>}
                    </motion.button>
                </div>
            )}
        </section>
    );
};

export default FlashSaleSection;