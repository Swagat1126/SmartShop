import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            await authAPI.register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            setMessage("");
            setShowPopup(true);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                setShowPopup(false);
                navigate("/login");
            }, 1500);
            return;
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed ❌");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold">SmartShop</h1>
            </nav>

            <div className="flex flex-1">

                <div className="hidden md:flex w-full items-center justify-center bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
                        alt="shopping"
                        className="w-3/4 rounded-xl shadow-lg"
                    />
                </div>

                <div className="flex flex-col justify-center w-full md:w-1/2 px-10">

                    <h2 className="text-3xl font-bold mb-2">Create an account</h2>
                    <p className="text-gray-800 mb-6">Enter your details below</p>

                    {message && (
                        <p className="text-sm text-center text-red-500 mb-2">{message}</p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">

                        <div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mb-1">{errors.name}</p>
                            )}
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full border-b py-2 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mb-1">{errors.email}</p>
                            )}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full border-b py-2 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mb-1">{errors.password}</p>
                            )}
                            <div className="flex items-center gap-2 border-b">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full py-2 outline-none focus:border-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="text-sm text-gray-600 px-2"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mb-1">{errors.confirmPassword}</p>
                            )}
                            <div className="flex items-center gap-2 border-b">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full py-2 outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <button className="bg-blue-600 text-white py-3 rounded-md mt-4 hover:bg-blue-700 transition">
                            Create Account
                        </button>

                        <button
                            type="button"
                            className="border py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://img.icons8.com/color/16/google-logo.png"
                                alt="google"
                            />
                            Sign up with Google
                        </button>

                        <p className="text-sm text-gray-500 text-center">
                            Already have account?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                className="text-blue-600 font-medium cursor-pointer"
                            >
                                Log in
                            </span>
                        </p>

                    </form>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white px-8 py-6 rounded-xl shadow-lg text-center">
                        <h3 className="text-xl font-semibold text-green-600">
                            ✅ Success!
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Account created successfully
                        </p>
                    </div>
                </div>
            )}

            <footer className="bg-black text-white text-center py-6">
                © 2026 SmartShop
            </footer>

        </div>
    );
};

export default Signup;