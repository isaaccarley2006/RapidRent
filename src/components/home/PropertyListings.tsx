import { Button } from "@/components/ui/button";
import { MdArrowForward } from "react-icons/md";
import { LiaBathSolid, LiaBedSolid } from "react-icons/lia";
import { CiRuler } from "react-icons/ci";

export default function PropertyListings() {
  const properties = [
    {
      id: 1,
      title: "123 Serenity Lane",
      price: "$450,000",
      image: "https://www.e-estate.co/assets/img/sect-1-img.webp",
      description:
        "A spacious and modern home with an open floor plan, large windows, and a beautifully landscaped garden. Perfect for those seeking peace and tranquility.",
    },
    {
      id: 2,
      title: "456 Harmony Drive",
      price: "$650,000",
      image: "https://www.e-estate.co/assets/img/sect-1-img.webp",
      description:
        "This elegant home features a sleek, contemporary design with a spacious living area, gourmet kitchen, and a private backyard oasis",
    },
    {
      id: 3,
      title: "789 Blue Boulevard",
      price: "$750,000",
      image: "https://www.e-estate.co/assets/img/sect-1-img.webp",
      description:
        "A cozy yet modern home that offers a perfect blend of comfort and style, with an open-concept living space and a tranquil outdoor area.",
    },
  ];

  return (
    <section className=" py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className=" flex flex-col ">
            <h2 className="text-4xl font-semibold pb-2 font-plus-jakarta-sans text-gray-900">
              Latest property listings
            </h2>
            <p className="text-gray-400 text-sm">
              Discover the newest additions to our exclusive real estate
              portfolio.
            </p>
          </div>
          <Button
            variant="default"
            className=" rounded-xl bg-slate-200 hover:bg-slate-200/50 text-gray-900"
          >
            View All Listings <MdArrowForward />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden"
            >
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 rounded-2xl object-cover"
                />
                <Button
                  size="sm"
                  className="absolute top-4 rounded-xl right-4 text-white  text-xs font-light "
                >
                  $350k
                </Button>
              </div>
              <div className="py-6 flex flex-col gap-3">
                <h3 className="text-xl font-plus-jakarta-sans font-semibold text-gray-900 ">
                  {property.title}
                </h3>

                <p className="text-gray-600 leading-5  font-poppins text-xs">
                  {property.description}
                </p>
                <div className=" flex gap-4 text-gray-500 font-plus-jakarta-sans">
                  <div className="flex gap-2 text-xs items-center">
                    <LiaBedSolid size={18} />
                    <div>4 bd</div>
                  </div>
                  <div className="flex gap-2 text-xs items-center">
                    <LiaBathSolid size={18} />
                    <div>3 ba</div>
                  </div>
                  <div className="flex gap-2 text-xs items-center">
                    <CiRuler size={18} />
                    <div>4000 sq ft</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
