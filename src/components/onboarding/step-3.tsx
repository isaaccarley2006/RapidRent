"use client";

import { useState } from "react";

interface Step3Props {
  onNext: () => void;
}

export default function Step3({ onNext }: Step3Props) {
  const [selected, setSelected] = useState<"renter" | "agency" | null>(null);

  const handleSelect = (type: "renter" | "agency") => {
    setSelected(type);
    setTimeout(onNext, 300);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <h2 className="text-3xl font-bold mb-12 text-center text-black">
        What describes you best?
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Renter Card */}
        <div
          onClick={() => handleSelect("renter")}
          className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
            selected === "renter" ? "ring-2 ring-orange-500" : "hover:shadow-lg"
          }`}
        >
          <div className="relative h-48 bg-gray-200">
            <img
              src="/person-renting-apartment.jpg"
              alt="Renter"
              className="object-cover"
            />
          </div>
          <div className="p-6 text-center bg-white">
            <h3 className="text-lg font-semibold text-black mb-2">
              I'm a renter
            </h3>
            <p className="text-gray-600 text-sm">Find houses</p>
          </div>
        </div>

        {/* Agency Card */}
        <div
          onClick={() => handleSelect("agency")}
          className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
            selected === "agency" ? "ring-2 ring-orange-500" : "hover:shadow-lg"
          }`}
        >
          <div className="relative h-48 bg-gray-200">
            <img
              src="/professional-real-estate-agent.jpg"
              alt="Agency"
              className="object-cover"
            />
          </div>
          <div className="p-6 text-center bg-white">
            <h3 className="text-lg font-semibold text-black mb-2">
              I'm an agency
            </h3>
            <p className="text-gray-600 text-sm">Post houses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
