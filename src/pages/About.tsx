import Benefits from "@/components/about/Benefits";
import Facts from "@/components/about/Facts";
import HowWeHelp from "@/components/about/HowWeHelp";
import Services from "@/components/about/Services";
import Tagline from "@/components/about/Tagline";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import WhyRapid from "@/components/about/WhyRapid";
import WhyWeExist from "@/components/about/WhyWeExist";
import React from "react";

function About() {
  return (
    <div>
      <WhyRapid />
      <Tagline />
      <WhyWeExist />

      <WhyChooseUs />
      <Benefits />
      <HowWeHelp />
      <Facts />
      <Services />
    </div>
  );
}

export default About;
