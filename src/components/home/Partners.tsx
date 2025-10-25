import { Button } from "@/components/ui/button";

export default function Partners() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-20">
          <div>
            <h2 className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900 mb-6">
              Our Trusted Partners
            </h2>
            <div>
              <p className=" text-slate-500 font-inter mb-6">
                We believe in the power of strong partnerships. Our trusted
                partners include some of the most respected names in the real
                estate and related industries.
              </p>

              <Button className="" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 items-center">
            <img
              src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fpartners%2Fflexport.webp&w=1080&q=75"
              alt="Partner 1"
              className="rounded-lg w-full"
            />
            <div className="flex flex-col gap-6">
              <img
                src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fpartners%2Fflexport.webp&w=1080&q=75"
                alt="Partner 2"
                className="rounded-lg w-full"
              />
              <img
                src="https://heaven-homes.vercel.app/_next/image?url=%2Fimages%2Fpartners%2Fflexport.webp&w=1080&q=75"
                alt="Partner 3"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
