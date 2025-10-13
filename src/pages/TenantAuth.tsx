import React, { useState } from "react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { TenantAuthBrandColumn } from "@/components/auth/tenant/TenantAuthBrandColumn";
import { TenantAuthForm } from "@/components/auth/tenant/TenantAuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAppSelector } from "@/store/hook";

const TenantAuth: React.FC = () => {
  const { loading } = useAuthRedirect();
  const { user, token } = useAppSelector((state) => state.auth);
  console.log(user, token);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [currentStep, setCurrentStep] = useState(1);

  if (loading) {
    return <LoadingSpinner />;
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    setCurrentStep(1); // Reset to first step when switching modes
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const totalSteps = authMode === "signup" ? 2 : 1;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="min-h-full grid lg:grid-cols-2">
          <TenantAuthBrandColumn
            currentStep={currentStep}
            totalSteps={totalSteps}
            mode={authMode}
          />

          <div className="flex items-center justify-center p-6 lg:p-8">
            <TenantAuthForm
              mode={authMode}
              onToggleMode={toggleAuthMode}
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TenantAuth;
