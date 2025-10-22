import React, { useState } from "react";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { OnboardingForm } from "@/components/onboarding/OnboardingFormOld";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AppLayout } from "@/components/layouts/AppLayout";

import Step1 from "@/components/onboarding/step-1";
import Step2 from "@/components/onboarding/step-2";
import Step3 from "@/components/onboarding/step-3";
import Step4 from "@/components/onboarding/step-4";
import Step5 from "@/components/onboarding/step-5";
import Step6 from "@/components/onboarding/step-6";

// const Onboarding: React.FC = () => {
//   const { loading } = useAuthRedirect();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <AppLayout showNavigation={false}>
//       <div className="min-h-screen bg-white font-sans">
//         <AuthLayout>
//           <OnboardingForm />
//         </AuthLayout>
//       </div>
//     </AppLayout>
//   );
// };

// export default Onboarding;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNextStep} />;
      case 2:
        return <Step2 onNext={handleNextStep} />;
      case 3:
        return <Step3 onNext={handleNextStep} />;
      case 4:
        return <Step4 onNext={handleNextStep} />;
      case 5:
        return <Step5 onNext={handleNextStep} />;
      case 6:
        return <Step6 />;
      default:
        return <Step1 onNext={handleNextStep} />;
    }
  };

  // flex items-center justify-center
  return (
    <div className="w-screen h-screen bg-[#F7F7F7] flex items-center justify-center p-0">
      {renderStep()}
    </div>
  );
}
