import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { orderAPI, cartAPI } from "../services/api";
import { ShoppingCart, MapPin, CreditCard, Truck } from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        
        // Try to load from API first, fallback to localStorage for fake data
        const loadCart = async () => {
            try {
                const cart = await cartAPI.getCart(userId);
                setCartItems(cart?.items || []);
            } catch (error) {
                console.log("Using localStorage cart (API unavailable)");
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                setCartItems(cart);
            }
        };
        
        loadCart();
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.firstName) newErrors.firstName = "First name is required";
            if (!formData.lastName) newErrors.lastName = "Last name is required";
            if (!formData.email) newErrors.email = "Email is required";
            if (!formData.phone) newErrors.phone = "Phone number is required";
        }

        if (step === 2) {
            if (!formData.address) newErrors.address = "Address is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.state) newErrors.state = "State is required";
            if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
        }

        if (step === 3) {
            if (!formData.cardName) newErrors.cardName = "Cardholder name is required";
            if (!formData.cardNumber || formData.cardNumber.length < 13)
                newErrors.cardNumber = "Valid card number is required";
            if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
            if (!formData.cvv || formData.cvv.length < 3)
                newErrors.cvv = "Valid CVV is required";
        }

        return newErrors;
    };

    const handleNext = () => {
        const stepErrors = validateStep(currentStep);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const stepErrors = validateStep(currentStep);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }

        try {
            const order = await orderAPI.placeOrder(userId, {
                address: formData.address,
                paymentMethod: "CARD",
            });
            
            // Clear cart after successful order
            try {
                await cartAPI.clearCart(userId);
            } catch {
                localStorage.removeItem("cart");
            }

            // Navigate to success page with order details
            navigate("/order-success", { state: { order } });
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order. Please try again.");
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = item.product?.price || item.price || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    const total = calculateTotal();
    const subtotal = total;
    const shipping = total > 500 ? 0 : 50;
    const tax = (subtotal * 0.1).toFixed(2);
    const finalTotal = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="py-10 px-4 md:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl font-bold mb-2">Checkout</h1>
                    <p className="text-gray-600 mb-10">Complete your purchase</p>

                    {/* Step Indicator */}
                    <div className="flex justify-between mb-10">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className="flex items-center flex-1"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ₹{
                                        step <= currentStep
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {step}
                                </div>
                                <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-300 text-gray-600">
                            ✓
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="md:col-span-2">
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                                    <div className="bg-white p-8 rounded-lg shadow">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                                👤
                                            </div>
                                            <h2 className="text-2xl font-semibold">Personal Information</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="John"
                                                />
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.firstName}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="Doe"
                                                />
                                                {errors.lastName && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.lastName}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="john@example.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Shipping Address */}
                                {currentStep === 2 && (
                                    <div className="bg-white p-8 rounded-lg shadow">
                                        <div className="flex items-center gap-3 mb-6">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                            <h2 className="text-2xl font-semibold">Shipping Address</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="123 Main St"
                                                />
                                                {errors.address && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.address}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                        placeholder="New York"
                                                    />
                                                    {errors.city && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.city}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                        placeholder="NY"
                                                    />
                                                    {errors.state && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.state}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={formData.zipCode}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                        placeholder="10001"
                                                    />
                                                    {errors.zipCode && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.zipCode}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Payment Information */}
                                {currentStep === 3 && (
                                    <div className="bg-white p-8 rounded-lg shadow">
                                        <div className="flex items-center gap-3 mb-6">
                                            <CreditCard className="w-6 h-6 text-blue-600" />
                                            <h2 className="text-2xl font-semibold">Payment Information</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="John Doe"
                                                />
                                                {errors.cardName && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.cardName}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                />
                                                {errors.cardNumber && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.cardNumber}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                        placeholder="MM/YY"
                                                    />
                                                    {errors.expiryDate && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.expiryDate}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
                                                        placeholder="123"
                                                        maxLength="4"
                                                    />
                                                    {errors.cvv && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.cvv}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 gap-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={currentStep === 1}
                                        className={`px-8 py-3 rounded font-semibold transition ₹{
                                            currentStep === 1
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-gray-500 text-white hover:bg-gray-600"
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                                        >
                                            Place Order
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-8 rounded-lg shadow h-fit sticky top-4">
                            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                            {cartItems.length === 0 ? (
                                <p className="text-gray-500">No items in cart</p>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                        {cartItems.map((item) => {
                                            const product = item.product || item;
                                            const price = product.price || 0;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between items-center pb-4 border-b"
                                                >
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {product.name || product.title || "Item"}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        ₹{(price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-3 border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping:</span>
                                            <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax (10%):</span>
                                            <span className="font-semibold">₹{tax}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                                            <span>Total:</span>
                                            <span className="text-blue-600">₹{finalTotal}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
