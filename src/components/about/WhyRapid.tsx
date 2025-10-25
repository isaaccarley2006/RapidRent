import { motion } from "framer-motion";
import { IMAGES } from "@/assets";
function WhyRapid() {
  return (
    <div className="relative h-full py-16 space-y-10 max-w-7xl w-full mx-auto flex flex-col items-center justify-center text-center xl:px-0 px-4">
      <div className="relative rounded-3xl  w-full overflow-hidden h-[50vh] md:h-[70vh]">
        <div className=" absolute top-0 flex flex-col items-center justify-center bottom-0 h-full w-full right-0 left-0 z-10">
          <motion.h1
            className="text-5xl md:text-7xl capitalize text-white mb-4 font-poppins font-medium"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-white text-xl mt-4 font-inter"
          >
            Find your perfect place to call home.
          </motion.p>
        </div>
        <motion.img
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={IMAGES.ABOUT_HERO_SECTION}
          alt="about"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl  from-accent/45 via-accent/10  to-white/45"></div>
      </div>
    </div>
  );
}

export default WhyRapid;
