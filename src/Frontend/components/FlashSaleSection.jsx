import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const FlashSaleSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      });
  }, []);

  return (
    <section className="px-10 py-10">
      <h2 className="text-2xl font-bold mb-6">Flash Sales 🔥</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map((item) => (
          <ProductCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              price: item.price,
              thumbnail: item.image,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default FlashSaleSection;