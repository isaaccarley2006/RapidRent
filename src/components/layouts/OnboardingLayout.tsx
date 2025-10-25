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
      <div className="bg-white  relative font-inter   ">
        <div className="bg-gradient-to-b flex h-full p-12    from-accent via-accent/30  to-white flex-col justify-around">
          <img
            src={IMAGES.STEP_2}
            className=" absolute top-[20%] bottom-0 left-[20%] right-0 opacity-80"
          />

          <div className="flex-1"></div>

          <div className="bg-gradient-to-b  from-white/10 via-transparent  to-white  w-full h-screen absolute left-0 bottom-0" />
          <div className="mt-12 text-center relative z-10  ">
            <p className="text-sm font-inter text-slate-500 mb-4">
              Powered by industry leading companies
            </p>
            <div className="flex items-center justify-center  flex-wrap gap-10 mx-auto ">
              <img
                className="w-10 h-10 aspect-square object-contain"
                src={IMAGES.AWS}
              />

              <img className="w-20 object-contain" src={IMAGES.HOUSING_HAND} />
              <img className="w-20 object-contain" src={IMAGES.EXPERIAN_LOGO} />
              <img className="w-20 object-contain" src={IMAGES.GOV_UK} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingLayout;
