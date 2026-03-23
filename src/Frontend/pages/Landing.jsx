import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FlashSaleSection from "../components/FlashSaleSection";
import Category from "../components/Category";
import BestSellingSection from "../components/BestSellingSection";
import BannerSection from "../components/BannerSection";
import ExploreSection from "../components/ExploreSection";
import NewArrivalSection from "../components/NewArrivalSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";

const Landing = () => {
    return (
        <div className="bg-gradient-to-br from-slate-100 via-white to-slate-200 min-h-screen">

            <Navbar />
            <Hero />
            <FlashSaleSection />
            <Category />
            <BestSellingSection />
            <BannerSection />
            <ExploreSection />
            <NewArrivalSection />
            <FeaturesSection />
            <Footer />

        </div>
    );
};

export default Landing;