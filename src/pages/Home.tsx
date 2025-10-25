import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/home";

import PropertyListings from "@/components/home/PropertyListings";
import Experience from "@/components/home/Experience";

import LocationMarquee from "@/components/home/LocationMarquee";
import RapidRentSteps from "@/components/home/RapidRentSteps";
import Logos from "@/components/home/Logos";
import { useLocation } from "react-router-dom";
import Services from "@/components/about/Services";

const Home: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <>
      <Helmet>
        <title>RapidRent - Find Your Perfect Rental Property</title>
        <meta
          name="description"
          content="Discover quality rental properties with RapidRent. Browse verified listings, connect with landlords, and find your ideal home."
        />
        <link rel="canonical" href="https://rentview.co.uk/" />
        <meta property="og:url" content="https://rentview.co.uk/" />
        <meta
          property="og:title"
          content="RapidRent - Find Your Perfect Rental Property"
        />
        <meta
          property="og:description"
          content="Discover quality rental properties with RapidRent. Browse verified listings, connect with landlords, and find your ideal home."
        />
      </Helmet>
      {/* max-w-7xl */}
      <div className="min-h-screen bg-white  font-sans">
        <HeroSection />
        <RapidRentSteps />
        <Logos />
        <PropertyListings />
        <Experience />

        <LocationMarquee />
        <Services />
        {/* <Partners /> */}
      </div>
    </>
  );
};

export default Home;
