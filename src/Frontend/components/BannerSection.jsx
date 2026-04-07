const BannerSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-10">
            <div className="bg-black text-white rounded-xl p-10 flex flex-col md:flex-row justify-between items-center cursor-pointer overflow-hidden">

                <div className="md:w-1/2">
                    <p className="text-green-400 mb-2 font-semibold">Categories: Electronics</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Enhance Your Music Experience with Our Latest Speakers
                    </h2>

                    <button className="bg-green-500 hover:bg-green-600 transition-colors text-black font-bold px-8 py-3 rounded-lg">
                        Buy Now
                    </button>
                </div>

                {/* --- REAL IMAGE ADDED HERE --- */}
                <div className="mt-8 md:mt-0 w-full md:w-1/3 flex justify-center">
                    <img 
                        src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800" 
                        alt="Premium Speaker"
                        className="w-full h-auto object-contain drop-shadow-[0_20px_20px_rgba(255,255,255,0.2)]"
                    />
                </div>
                {/* ---------------------------- */}
                
            </div>
        </section>
    );
};

export default BannerSection;