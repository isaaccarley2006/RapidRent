import { useState } from "react";

import Step6 from "@/components/onboarding/step-6";
import OnboardingStep1 from "@/components/onboarding/onboarding-step-1";
import OnboardingStep2 from "@/components/onboarding/onboarding-step-2";
import OnboardingStep3 from "@/components/onboarding/onboarding-step-3";
import OnboardingStep4 from "@/components/onboarding/onboarding-step-4";
import OnboardingStep5 from "@/components/onboarding/onboarding-step-5";
import { Form, Formik } from "formik";
import {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
} from "@/components/onboarding/validation-schemas";

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

  const validationSchema = [
    null,
    step1ValidationSchema,
    step2ValidationSchema,
    step3ValidationSchema,
    step4ValidationSchema,
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;

      case 3:
        return <OnboardingStep3 />;
      case 4:
        return <OnboardingStep4 />;
      case 5:
        return <OnboardingStep5 />;
      case 6:
        return <Step6 />;
      default:
        return <OnboardingStep1 />;
    }
  };
  return (
    <Formik
      initialValues={{
        // Step 1
        userType: "",

        // Step 2
        email: "",
        password: "",
        // Step 3
        verificationCode: "",
        // Step 4
        firstName: "",
        lastName: "",
        phone: "",
        citizenshipStatus: "",
      }}
      onSubmit={(values) => {
        console.log(values, "valuesvalues");
        handleNextStep();
      }}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema[currentStep]}
    >
      {() => <Form>{renderStep()}</Form>}
    </Formik>
  );
}
