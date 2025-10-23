"use client";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useFormikContext } from "formik";
import { Check } from "lucide-react";

export default function OnboardingStep5() {
  const formik = useFormikContext();
  return (
    <OnboardingLayout>
      <div className="max-w-md w-full mx-auto flex flex-col items-center space-y-12">
        <h2 className="text-2xl font-plus-jakarta-sans text-center font-semibold  text-black">
          Account created successfully!
        </h2>
        <div className="">
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
    </OnboardingLayout>
  );
}
