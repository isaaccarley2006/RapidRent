"use client";

import { IMAGES } from "@/assets";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import clsx from "clsx";
import { ListChecks, ClipboardCheck } from "lucide-react";
import { HiOutlineMailOpen } from "react-icons/hi";

import { LuBadgeCheck } from "react-icons/lu";
export default function RapidRentSteps() {
  const size = 54;
  const strokeWidth = 0.9;
  const steps = [
    {
      img: IMAGES.STEP_1,
      icon: (
        <LuBadgeCheck
          strokeWidth={strokeWidth}
          size={size}
          className=" text-white"
        />
      ),
      title: "Create account",
      description: "Add your ID, income, and right-to-rent checks once.",
    },
    {
      img: IMAGES.STEP_2,
      icon: (
        <HiOutlineMailOpen
          strokeWidth={strokeWidth}
          size={size}
          className=" text-white"
        />
      ),
      title: "Confirm email",
      description:
        "Your verified profile unlocks homes that match your income and criteria.",
    },
    {
      img: IMAGES.STEP_3,
      icon: (
        <ClipboardCheck
          strokeWidth={strokeWidth}
          size={size}
          className="  text-white"
        />
      ),
      title: "Tell us about yourself",
      description: "Add your ID, income, and right-to-rent checks once.",
    },
  ];

  return (
    // Get Started in Three Easy Steps
    <section className="py-16  bg-white px-4  max-w-7xl mx-auto">
      <h2 className="text-4xl text-center mb-12 font-semibold pb-2 font-plus-jakarta-sans text-gray-900">
        How it works
      </h2>

      <div className="max-w-7xl mx-auto   grid md:grid-cols-3 gap-8 text-center">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={clsx(
              "shadow-none overflow-hidden border border-t-0 rounded-xl  flex flex-col items-center text-center"
              // index < 2
              //   ? "border-l-0 border-t-0 md:border-b-0 md:border-r border-r-0"
              //   : "border-none"
            )}
          >
            <CardHeader className="bg-gradient-to-br relative overflow-hidden   from-accent  to-white w-full mb-4">
              <div className="py-20 flex w-full justify-center ">
                {/* {step.icon} */}
              </div>
              <div className="text-xl text-transparent absolute top-4 left-6   font-poppins ">
                Step {index + 1}.
              </div>
              <img
                src={step.img}
                className=" absolute top-[20px] bottom-0 left-[20px] right-0 opacity-80"
              />
            </CardHeader>
            <CardContent className="flex relative flex-col items-center">
              <h3 className="text-lg font-plus-jakarta-sans font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-slate-500 font-inter text-sm max-w-xs">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
