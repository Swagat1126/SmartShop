import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const BestSellingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-10">
            <h2 className="text-2xl font-bold mb-6">Best Selling 🔥</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 cursor-pointer">
                {loading ? (
                    <p className="text-gray-500">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500">No products found.</p>
                ) : (
                    products.slice(0, 4).map((item) => (
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
        </section>
    );
};

export default BestSellingSection;