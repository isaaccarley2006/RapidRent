"use client";

import { Button } from "@/components/ui/button";

interface Step4Props {
  onNext: () => void;
}

export default function Step4({ onNext }: Step4Props) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-8 text-black text-center">
          Account created successfully!
        </h2>

        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <Button
          onClick={onNext}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
        >
          Finish Setup
        </Button>
      </div>
    </div>
  );
}
