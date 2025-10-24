import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeHero from "@/assets/home-hero.png";
import { MdOutlineHomeWork } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { Input } from "@/components/ui/input";
import { CiFilter } from "react-icons/ci";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const handleSearch = () => {
    if (searchLocation.trim()) {
      navigate(`/listings?location=${encodeURIComponent(searchLocation)}`);
    }
  };
  const handleRenterClick = () => {
    navigate("/auth/tenant");
  };
  const handleLandlordClick = () => {
    navigate("/auth/agent");
  };
  return (
    <section
      className="relative h-[80vh] bg-cover  -top-16   bg-center"
      style={{
        backgroundImage: `url(${homeHero})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl text-white mb-4 font-poppins font-medium"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Find Your Next
          <br />
          Home Sweet Home
        </motion.h1>
      </div>

      <Search />
    </section>
  );
};

const Search = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full -mt-10 max-w-7xl mx-auto px-4"
    >
      <SearchBar />
    </motion.div>
  );
};

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // optionally resume typing when blurred
    setIsFocused(false);
  };
  return (
    <div className="flex gap-4   z-10 relative  shadow shadow-gray-100   items-center bg-white rounded-3xl p-4">
      <div className="flex gap-4 border-r flex-1 items-center">
        <MdOutlineHomeWork className=" text-gray-500" />

        <div className="relative  w-full">
          <input
            type="text"
            // placeholder="Enter an address, neighborhood, city, or  postcode"
            className="flex-1 font-plus-jakarta-sans text-sm  outline-none  py-3 rounded-lg text-gray-900"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Animated placeholder */}
          {!isFocused && !search && (
            <div
              ref={placeholderRef}
              className="absolute  top-1/2 text-sm transform -translate-y-1/2 text-text-muted pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis w-[calc(100%-2.5rem)]"
            >
              <Typewriter
                options={{
                  strings: [
                    "Three-bedroom house near tube, pet-friendly.",
                    "Pet-friendly three-bed home close to public transport.",
                    "Three-bed rental within walking distance of a tube station, pets allowed.",
                    "Three-bedroom house in London, pets accepted, near underground.",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 20,
                  deleteSpeed: 40,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-gray-50 hover:text-black"
      >
        <CiFilter className="text-gray-500" />
      </Button>
      <Button size="lg" className="rounded-xl font-plus-jakarta-sans">
        Search Property
      </Button>
    </div>
  );
};
