import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black text-white mt-10">

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">


                <div>
                    <h2 className="text-2xl font-bold mb-3">SmartShop</h2>
                    <p className="text-gray-400 text-sm">
                        Your one-stop destination for the latest gadgets, fashion,
                        and accessories at the best prices.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="hover:text-white">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/about">About</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/products">Products</Link>
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="hover:text-white">
                            <Link to="/category/Phones">Phones</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/category/Computers">Computers</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/category/Gaming">Gaming</Link>
                        </li>
                        <li className="hover:text-white">
                            <Link to="/category/Headphones">Headphones</Link>
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="font-semibold mb-3">Subscribe</h3>
                    <p className="text-gray-400 text-sm mb-3">
                        Get latest updates and offers
                    </p>

                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="px-3 py-2 w-full text-black rounded-l"
                        />
                        <button className="bg-red-500 px-4 rounded-r">
                            ➤
                        </button>
                    </div>
                </div>

            </div>


            <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-800">
                © 2026 SmartShop. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;