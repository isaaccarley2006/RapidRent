import React from "react";
import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/home";
import ValueProposition from "@/components/home/ValueProposition";
import PropertyListings from "@/components/home/PropertyListings";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Benefits from "@/components/home/Benefits";
import Experience from "@/components/home/Experience";
import Facts from "@/components/home/facts";
import Services from "@/components/home/Services";
import Partners from "@/components/home/Partners";
import LocationMarquee from "@/components/home/LocationMarquee";

const Home: React.FC = () => {
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
      <div className="min-h-screen bg-white font-sans">
        <HeroSection />
        <ValueProposition />
        <PropertyListings />
        <WhyChooseUs />
        <Benefits />
        <Experience />
        <Facts />
        <LocationMarquee />
        <Services />
        <Partners />
      </div>
    </>
  );
};

export default Home;
