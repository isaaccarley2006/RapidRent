import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Image container */}
          <div className="w-full relative overflow-hidden rounded-lg flex">
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fbenefit-1.webp&w=1920&q=75"
              alt="Why choose us"
              className="w-full h-full absolute top-0 right-0 left-0 bottom-0 object-cover rounded-lg"
            />
          </div>

          {/* Text content */}
          <div className="">
            <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-6">
              Why choose us?
            </h2>
            <p className="text-gray-500 font-poppins mb-8 text-md">
              We are committed to providing exceptional service and unparalleled
              expertise in the real estate market. Our features are designed to
              ensure a smooth and rewarding experience for our clients, whether
              you are buying, selling, or investing.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Expert guidance",
                "Curated listings",
                "Transparent pricing",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={18} className="text-primary" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
