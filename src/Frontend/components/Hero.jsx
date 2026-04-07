import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Cpu, 
    Shirt, 
    Home, 
    Trophy, 
    Gamepad 
} from "lucide-react";

// --- Data Arrays ---
const bannerImages = [
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1200", 
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1200", 
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200", 
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=1200", 
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200", 
];

const categoryItems = [
    { name: "Electronics", icon: <Cpu size={18} /> },
    { name: "Fashion", icon: <Shirt size={18} /> },
    { name: "Home", icon: <Home size={18} /> },
    { name: "Sports", icon: <Trophy size={18} /> },
    { name: "Gaming", icon: <Gamepad size={18} /> },
];

// --- Sub-Component: CategoryPills ---
const CategoryPills = () => {
    const navigate = useNavigate();
    return (
        <div className="flex gap-4 overflow-x-auto mb-8 pb-4 scrollbar-hide">
            {categoryItems.map((item) => (
                <motion.div
                    key={item.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(`/category/${item.name}`)}
                    className="group flex items-center gap-3 cursor-pointer px-6 py-2.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-red-600 hover:shadow-md transition-all duration-300 whitespace-nowrap"
                >
                    <span className="text-gray-500 group-hover:text-red-600 transition-colors duration-300">
                        {item.icon}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wide text-gray-700 group-hover:text-black transition-colors duration-300">
                        {item.name}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                </motion.div>
            ))}
        </div>
    );
};

// --- Main Component: Hero ---
const Hero = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % bannerImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-6 md:px-10 py-6"
        >
            {/* Category Pills at the top of Hero */}
            <CategoryPills />

            {/* Banner Slider */}
            <div className="relative bg-black text-white rounded-xl overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        className="relative w-full h-[400px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img 
                            src={bannerImages[current]} 
                            alt="Banner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Text Content */}
                        <div className="relative z-10 text-center px-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl">
                                {current === 0 && "Next-Gen Tech"}
                                {current === 1 && "Level Up Your Play"}
                                {current === 2 && "Step Into Style"}
                                {current === 3 && "Gear Up for Victory"}
                                {current === 4 && "Modernize Your Home"}
                            </h2>
                            <p className="mt-4 text-lg md:text-xl font-bold text-red-500 bg-white/90 inline-block px-4 py-1 rounded shadow-lg">
                                UP TO 50% OFF
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Shop Now Button - Anchored Overlay */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-10 left-10 z-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/category/Electronics")}
                        className="bg-red-600 text-white font-black px-8 py-3 rounded uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                    >
                        Shop Now
                    </motion.button>
                </motion.div>

                {/* Dots Indicators */}
                <div className="absolute bottom-6 right-10 flex gap-2 z-20">
                    {bannerImages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 transition-all duration-300 rounded-full ${
                                current === index ? "w-8 bg-red-600" : "w-2 bg-white/50"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Hero;