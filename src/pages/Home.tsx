import React from "react";
import { Helmet } from "react-helmet-async";
import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
} from "@/components/home";

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
      <div className="min-h-screen bg-white font-sans">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </div>
    </>
  );
};

export default Home;
