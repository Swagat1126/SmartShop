import React from 'react';
// --- 1. IMPORT YOUR IMAGES FROM THE ASSETS FOLDER ---
import ps5Img from '../../assets/ps5.png';
import womenImg from '../../assets/women.png';
import speakerImg from '../../assets/Speaker.png';
import perfumeImg from '../../assets/perfume.png';

const NewArrivalSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-10">
            {/* Header */}
            <h2 className="text-4xl font-bold mb-6">New Arrival</h2>

            {/* --- Main 2-Column Grid --- */}
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* --- Left Column: Large PS5 Card --- */}
                <div className="relative bg-black rounded-xl overflow-hidden h-96">
                    {/* Add object-contain for products to show the whole item */}
                    <img 
                        src={ps5Img} 
                        alt="PlayStation 5 Console" 
                        className="w-full h-full object-contain p-8"
                    />
                </div>

                {/* --- Right Column: Smaller Cards Grid --- */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* --- Top-Right Row: Wide Women's Image --- */}
                    <div className="relative col-span-2 bg-black rounded-xl overflow-hidden h-40">
                        {/* object-cover is better for human models in a wide space */}
                        <img 
                            src={womenImg} 
                            alt="Women's Fashion Collection" 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* --- Bottom-Left Small Card: Speaker --- */}
                    <div className="relative bg-black rounded-xl overflow-hidden h-40">
                        <img 
                            src={speakerImg} 
                            alt="Premium Speaker" 
                            className="w-full h-full object-contain p-6"
                        />
                    </div>

                    {/* --- Bottom-Right Small Card: Perfume --- */}
                    <div className="relative bg-black rounded-xl overflow-hidden h-40">
                        <img 
                            src={perfumeImg} 
                            alt="Luxury Perfume Bottle" 
                            className="w-full h-full object-contain p-6"
                        />
                    </div>

                </div> {/* End Smaller Cards Grid */}
            </div> {/* End Main Grid */}
        </section>
    );
};

export default NewArrivalSection;