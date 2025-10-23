import { BiSolidRightArrow } from "react-icons/bi";

export default function Experience() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex ">
          <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-12 text-balance flex-1">
            Experience Our Properties and Services in Action
          </h2>
          <p className="flex-1 max-w-md text-slate-500 font-inter">
            Explore our collection of videos showcasing our stunning properties,
            client testimonials, virtual tours, and expert advice.
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden h-[70vh]">
          <img
            src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fvideo.webp&w=1080&q=75"
            alt="Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition">
              <BiSolidRightArrow className="text-accent ml-1" size={26} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
