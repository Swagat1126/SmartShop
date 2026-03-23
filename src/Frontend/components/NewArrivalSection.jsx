import ps5Img from "../../assets/ps5.png";
import womenImg from "../../assets/women.png";
import speakerImg from "../../assets/speakers.png";
import perfumeImg from "../../assets/perfume.png";

const NewArrivalSection = () => {
    return (
        <section className="px-10 py-10">

            <h2 className="text-4xl font-bold mb-6">New Arrival</h2>

            <div className="grid md:grid-cols-2 gap-6">


                <div className="relative bg-black rounded-xl overflow-hidden">
                    <img
                        src={ps5Img}
                        alt="ps5"
                        className="w-3/4 h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">


                    <div className="relative col-span-2 bg-black rounded-xl overflow-hidden">
                        <img
                            src={womenImg}
                            alt="women"
                            className="w-3/4 h-full object-cover"
                        />


                    </div>


                    <div className="relative bg-black rounded-xl overflow-hidden">
                        <img
                            src={speakerImg}
                            alt="speaker"
                            className="w-3/4 h-full object-cover"
                        />


                    </div>


                    <div className="relative bg-black rounded-xl overflow-hidden">
                        <img
                            src={perfumeImg}
                            alt="perfume"
                            className="w-3/4 h-full object-cover"
                        />

                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewArrivalSection;