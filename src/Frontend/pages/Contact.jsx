import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent successfully ✅");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div className="bg-gray-50 min-h-screen">

            <Navbar />

            <div className="px-10 py-10 max-w-4xl mx-auto">

                <h1 className="text-4xl font-bold mb-6 text-center">
                    Contact Us
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow space-y-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full border p-3 rounded h-32"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded"
                    >
                        Send Message
                    </button>

                </form>

            </div>

            <Footer />

        </div>
    );
};

export default Contact;