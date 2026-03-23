import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">

            <Navbar />

            <div className="px-10 py-10 max-w-6xl mx-auto">

                <h1 className="text-4xl font-bold mb-6 text-center">
                    About SmartShop
                </h1>

                <p className="text-gray-600 text-center mb-10">
                    SmartShop is a modern e-commerce platform designed to provide
                    a seamless shopping experience with the latest products and
                    best deals.
                </p>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-xl font-semibold mb-2">🚀 Our Mission</h3>
                        <p className="text-gray-500">
                            To deliver quality products with fast and reliable service.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-xl font-semibold mb-2">💡 Innovation</h3>
                        <p className="text-gray-500">
                            We bring the latest technology and trends to your doorstep.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-xl font-semibold mb-2">🤝 Trust</h3>
                        <p className="text-gray-500">
                            Customer satisfaction and trust are our top priorities.
                        </p>
                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
};

export default About;