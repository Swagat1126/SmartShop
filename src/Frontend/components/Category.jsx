import { useNavigate } from "react-router-dom";

const Category = () => {
    const navigate = useNavigate();

    return (
        <section className="px-10 py-10">
            <h2 className="text-2xl font-bold mb-6">Browse By Category</h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {["Phones", "Computers", "Camera", "Gaming", "Watch", "Headphones"].map((cat) => (
                    <div
                        key={cat}
                        onClick={() => navigate(`/category/${cat}`)}
                        className="bg-white p-4 text-center rounded shadow cursor-pointer hover:bg-black hover:text-white transition"
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Category;