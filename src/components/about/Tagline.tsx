import { IMAGES } from "@/assets";

function Tagline() {
  return (
    <p className="text-gray-500 max-w-7xl mx-auto flex  px-10 items-center  md:text-xl py-5 md:py-10  border-l-2  border-accent mt-4 font-inter">
      <div className="flex-1 hidden md:flex">
        <img className="w-32 h-32" src={IMAGES.LOGO_PRIMARY} />
      </div>
      <div className="flex-1 font-plus-jakarta-sans  text-right">
        " At RapidRent, we’re transforming the way people rent – making the
        process faster, fairer, and more transparent for everyone. We believe
        renting should be simple, not stressful."
      </div>
    </p>
  );
}

export default Tagline;
