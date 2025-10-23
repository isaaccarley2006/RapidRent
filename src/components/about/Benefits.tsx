import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Benefits() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Text content */}
          <div className="">
            <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-6">
              Benefits of choosing RapidRent
            </h2>
            <p className="text-gray-500 font-poppins mb-8 text-md">
              We offer a range of benefits designed to provide the best real
              estate experience possible. Discover the key advantages of
              partnering with RapidRent and see why so many clients choose us
              for their real estate needs.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Tailored approach",
                "Extensive network",
                "Proven track record",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={18} className="text-primary" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="rounded-xl">
              Learn More
            </Button>
          </div>
          {/* Image container */}
          <div className="w-full relative overflow-hidden rounded-lg flex">
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fbenefit-2.webp&w=1080&q=75"
              alt="Why choose us"
              className="w-full h-full absolute top-0 right-0 left-0 bottom-0 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
