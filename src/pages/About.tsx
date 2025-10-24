import Benefits from "@/components/about/Benefits";
import Facts from "@/components/about/Facts";
import Services from "@/components/about/Services";
import ValueProposition from "@/components/about/ValueProposition";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import React from "react";

function About() {
  return (
    <div>
      <ValueProposition />
      <WhyChooseUs />
      <Benefits />
      <Facts />
      <Services />
    </div>
  );
}

export default About;
