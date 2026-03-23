import SpeakerImg from "../../assets/Speaker.png";

const BannerSection = () => {
    return (
        <section className="px-10 py-10">
            <div className="bg-black text-white rounded-xl p-10 flex justify-between items-cente cursor-pointer">

                <div>
                    <p className="text-green-400 mb-2">Categories</p>
                    <h2 className="text-3xl font-bold mb-4">
                        Enhance Your Music Experience with Our Latest Speakers
                    </h2>

                    <button className="bg-green-500 px-6 py-2 rounded">
                        Buy Now
                    </button>
                </div>

                <img
                    src={SpeakerImg}
                    alt="speaker"
                    className="hidden md:block w-1/3"
                />
            </div>
        </section>
    );
};

export default BannerSection;