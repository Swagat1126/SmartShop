import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const BestSellingSection = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            });
    }, []);

    return (
        <section className="px-10 py-10">
            <h2 className="text-2xl font-bold mb-6">Best Selling 🔥</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 cursor-pointer">
                {products.slice(0, 4).map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default BestSellingSection;