import { IMAGES } from "@/assets";

function OnboardingLayout({ children }) {
  return (
    <div className="grid w-screen min-h-svh bg-white  grid-cols-2 gap-0">
      {/* Left Side - Form */}
      <div className="p-12 items-center flex flex-col justify-center">
        <div className="mb-8 absolute top-8 left-8 flex items-center gap-2">
          <img src={IMAGES.LOGO_PRIMARY} className="w-8" />
          <h1 className="text-2xl font-semibold mt-1">
            <span className="text-black">Rapid</span>
            <span className="text-orange-500">Rent</span>
          </h1>
        </div>

        {children}
      </div>

      {/* Right Side - Features */}
      <div className="bg-white p-12 flex font-inter bg-gradient-to-b  from-accent  to-white  flex-col justify-around">
        <div className="flex-1"></div>
        {/* <div className="text-right mb-4">
            <span className="text-sm text-gray-500  cursor-pointer">
              Want to learn more?{" "}
              <span className=" text-orange-500">Schedule a demo</span>
            </span>
          </div> */}

        {/* <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-8 text-black">
              Smart. Secure.{" "}
              <span className="text-orange-500">Stress-Free Renting</span>
            </h3>

            <div className="space-y-4">
              {[
                "Find and apply for homes in minutes, not days",
                "Verified listings and background-checked landlords",
                "AI-powered match system for your ideal home",
                "Paperless, and hassle-free",
              ].map((content, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-accent/20 rounded p-0.5 ">
                    <IoCheckmarkSharp size={14} className="text-accent" />
                  </div>
                  <span className="text-gray-700">{content}</span>
                </div>
              ))}
            </div>
          </div> */}

        <div className="mt-12 text-center ">
          <p className="text-sm font-inter text-slate-500 mb-4">
            Powered by industry leading companies
          </p>
          <div className="flex items-center justify-center  flex-wrap gap-10 mx-auto ">
            <img
              className="w-10 h-10 aspect-square object-contain"
              src="https://webobjects2.cdw.com/is/image/CDW/aws1?$transparent$"
            />

            <img className="w-20 object-contain" src={IMAGES.HOUSING_HAND} />
            <img className="w-20 object-contain" src={IMAGES.EXPERIAN_LOGO} />
            <img className="w-20 object-contain" src={IMAGES.GOV_UK} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingLayout;
