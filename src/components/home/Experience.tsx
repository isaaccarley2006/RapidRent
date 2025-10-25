import { IMAGES } from "@/assets";
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
            src={IMAGES.EXPERIENCE_SECTION}
            alt="Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-bl rounded-b-3xl  from-accent/45 via-accent/10  to-white/45"></div>
          Fine, and instead of this image, we will put our image like if you
          have some images, so we can put there
        </div>
      </div>
    </section>
  );
}
