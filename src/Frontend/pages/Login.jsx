import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

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
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setLoading(false);
            return;
        }

        try {
            // Try user login first
            const trimmedFormData = {
                email: formData.email.trim(),
                password: formData.password
            };
            const response = await authAPI.login(trimmedFormData);
            
            if (response?.user) {
                login(response.user, false);
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                    navigate("/");
                }, 1500);
                return;
            }
        } catch (err) {
            // If user login fails, try admin login
            try {
                const trimmedFormData = {
                    email: formData.email.trim(),
                    password: formData.password
                };
                const adminResponse = await authAPI.adminLogin(trimmedFormData);
                
                if (adminResponse?.admin) {
                    login(adminResponse.admin, true);
                    setShowPopup(true);

                    setTimeout(() => {
                        setShowPopup(false);
                        navigate("/admin/dashboard");
                    }, 1500);
                    return;
                }
            } catch (adminErr) {
                setMessage("Invalid credentials ❌");
            }
        } finally {
            setLoading(false);
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
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop"
                        alt="login"
                        className="w-3/4 rounded-xl shadow-lg"
                    />
                </div>

                <div className="flex flex-col justify-center w-full md:w-1/2 px-10">

                    <h2 className="text-3xl font-bold mb-2">Login to your account</h2>
                    <p className="text-gray-600 mb-6">Enter your details below</p>

                    {message && (
                        <p className="text-sm text-center text-red-500 mb-2">{message}</p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">

                        <div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mb-1">{errors.email}</p>
                            )}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full border-b py-2 outline-none focus:border-black"
                                disabled={loading}
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
                                    disabled={loading}
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

                        <button 
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-md mt-4 hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <p className="text-sm text-gray-500 text-center">
                            Don’t have an account?{" "}
                            <span
                                onClick={() => navigate("/signup")}
                                className="text-blue-600 font-medium cursor-pointer"
                            >
                                Sign up
                            </span>
                        </p>

                    </form>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white px-8 py-6 rounded-xl shadow-lg text-center">
                        <h3 className="text-xl font-semibold text-green-600">
                            ✅ Login Successful!
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Welcome back 👋
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

export default Login;