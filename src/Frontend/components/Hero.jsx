import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import banner1 from "../../assets/Banner.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";

const Hero = () => {
    const navigate = useNavigate();

    const banners = [banner1, banner2, banner3];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-10 py-6"
        >

            <div className="flex gap-4 overflow-x-auto mb-6 pb-2">
                {["Electronics", "Fashion", "Home", "Sports", "Gaming"].map((item) => (
                    <motion.div
                        key={item}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/category/${item}`)}
                        className="cursor-pointer px-5 py-2 rounded-full bg-white shadow hover:bg-black hover:text-white transition whitespace-nowrap"
                    >
                        {item}
                    </motion.div>
                ))}
            </div>

            <div className="relative bg-black text-white rounded-xl overflow-hidden">

                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={banners[current]}
                        alt="banner"
                        className="w-full h-[350px] object-contain bg-black"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                </AnimatePresence>

                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-1/2 left-10 transform -translate-y-1/2"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Up to 10% off Voucher
                    </h2>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/category/Electronics")}
                        className="mt-4 bg-white text-black px-6 py-2 rounded"
                    >
                        Shop Now
                    </motion.button>
                </motion.div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <motion.div
                            key={index}
                            animate={{
                                scale: current === index ? 1.4 : 1,
                                opacity: current === index ? 1 : 0.5,
                            }}
                            className={`w-2 h-2 rounded-full ${current === index ? "bg-white" : "bg-gray-400"
                                }`}
                        ></motion.div>
                    ))}
                </div>

            </div>
        </motion.div>
    );
};

export default Hero;