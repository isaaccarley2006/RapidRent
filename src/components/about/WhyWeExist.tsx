import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function WhyWeExist() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-6">
              Why We Exist
            </h2>
            <p className="text-gray-500 font-poppins mb-8 text-md">
              RapidRent fixes this by putting trust, transparency, and speed at
              the heart of every rental journey.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Today’s rental market is broken",
                "Renters face endless paperwork and uncertainty",
                "Landlords lose income to empty properties",
                "Agents spend hours chasing unverified enquiries",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={18} className="text-primary" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            {/* <p className="text-gray-500 font-poppins mb-8 text-md">
              RapidRent fixes this by putting trust, transparency, and speed at
              the heart of every rental journey.
            </p> */}

            <Button size="lg" className="">
              Contact Us
            </Button>
          </div>

          {/* Image grid (aligned) */}
          <div className="grid grid-cols-2 gap-4 h-full">
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fbenefit-2.webp&w=1080&q=75"
              alt="Why choose us"
              className="object-cover w-full h-full rounded-lg"
            />
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fbenefit-2.webp&w=1080&q=75"
              alt="Why choose us"
              className="object-cover w-full h-full  rounded-lg"
            />
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fbenefit-2.webp&w=1080&q=75"
              alt="Why choose us"
              className="col-span-2 object-cover w-full max-h-52 h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
