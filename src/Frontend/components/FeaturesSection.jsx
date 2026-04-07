const FeaturesSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <div className="text-2xl mb-2">🚚</div>
                    <h4 className="font-semibold">FREE AND FAST DELIVERY</h4>
                    <p className="text-gray-500 text-sm">
                        Free delivery for all orders over ₹500
                    </p>
                </div>

                <div>
                    <div className="text-2xl mb-2">🎧</div>
                    <h4 className="font-semibold">24/7 CUSTOMER SERVICE</h4>
                    <p className="text-gray-500 text-sm">
                        Friendly support anytime
                    </p>
                </div>

                <div>
                    <div className="text-2xl mb-2">💰</div>
                    <h4 className="font-semibold">MONEY BACK GUARANTEE</h4>
                    <p className="text-gray-500 text-sm">
                        30 days return policy
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;