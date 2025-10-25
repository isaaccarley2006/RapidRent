import { IMAGES } from "@/assets";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function HowWeHelp() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Image container */}
          <div className="w-full relative overflow-hidden rounded-lg flex">
            <img
              src={IMAGES.ABOUT_HERO_SECTION}
              alt="Why choose us"
              className="w-full h-full absolute top-0 right-0 left-0 bottom-0 object-cover rounded-xl"
            />
          </div>

          {/* Text content */}
          <div className="">
            <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-6">
              How We Help
            </h2>
            <p className="text-gray-500 font-poppins mb-8 text-md">
              We centralise renting in one platform for everyone:
            </p>
            <ul className="space-y-6 mb-8">
              {[
                {
                  title: "For tenants",
                  content:
                    "A verified RapidRent ID that covers ID, affordability, credit, and references – ready to use for every property. No repeated paperwork. No waiting.",
                },
                {
                  title: "For landlords",
                  content:
                    "Shorter void periods and pre-verified tenants that match their criteria, saving time and reducing risk",
                },
                {
                  title: "For agents",
                  content:
                    "One dashboard to manage verified applicants, faster lets, and less admin. No more chasing, referencing it’s done! Focus on generating business value, remove blockers.",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="text-white bg-accent rounded-full flex items-center text-xl justify-center w-12 h-12 p-2">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 font-plus-jakarta-sans mb-4 mt-2 text-xl font-medium">
                      {item.title}
                    </div>
                    <div className="text-muted-foreground font-inter ">
                      {item.content}
                    </div>
                  </div>
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
