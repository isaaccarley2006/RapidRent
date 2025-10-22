"use client";

import { Button } from "@/components/ui/button";
import { useFormikContext } from "formik";
import { Check } from "lucide-react";

export default function OnboardingStep5() {
  const formik = useFormikContext();
  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-medium mb-12  font-poppins text-center text-black">
          Account created successfully!
        </h2>

        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={42} className="text-white" />
          </div>
        </div>

        <div className="max-w-[240px] w-full mx-auto">
          <Button
            onClick={() => formik.handleSubmit()}
            className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
          >
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
