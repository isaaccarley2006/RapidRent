import type React from "react";
import {
  FolderOpen,
  TrendingUp,
  Shield,
  User,
  Info,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IDVerificationModal from "@/components/new-profile/IdVerificationModal";

interface VerificationCard {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "verified";
  icon: React.ReactNode;
  poweredBy: string;
  buttonText: string;
  onClick?: () => void;
}

export default function VerificationCenter() {
  const [idVerificationModal, setIdVerificationsModal] = useState(false);
  const verifications: VerificationCard[] = [
    {
      id: "credit-check",
      title: "Credit Check",
      description: "Financial verification",
      status: "not-started",
      icon: <FolderOpen className="w-8 h-8 text-orange-500" />,
      poweredBy: "Experian",
      buttonText: "Verify Credit",
      onClick: () => setIdVerificationsModal(true),
    },
    {
      id: "income-verification",
      title: "Income Verification",
      description: "Employment & earnings",
      status: "not-started",
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      poweredBy: "PLAID",
      buttonText: "Verify Income",
    },
    {
      id: "right-to-rent",
      title: "Right to Rent",
      description: "Legal status verification",
      status: "not-started",
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      poweredBy: "Onfido",
      buttonText: "Verify Right to Rent",
    },
    {
      id: "identity-check",
      title: "Identity Check",
      description: "Photo ID verification",
      status: "verified",
      icon: <User className="w-8 h-8 text-orange-500" />,
      poweredBy: "Onfido",
      buttonText: "Verified",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 ">
        {verifications.map((verification) => (
          <div
            key={verification.id}
            className="bg-white col-span-1 font-poppins rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header with icon and info button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 bg-accent/10 hover:bg-accent/10 hover:text-gray-600"
                >
                  {verification.icon}
                </Button>
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    {verification.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {verification.description}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:bg-gray-400/10 hover:text-gray-600"
              >
                <Info className="w-5 h-5" />
              </Button>
            </div>

            {/* Status */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-900 mb-2">Status</p>
              <Badge variant="secondary" className="text-xs font-semibold">
                Not Started
              </Badge>
            </div>

            {/* Powered by */}
            <p className="text-xs text-center font-medium text-gray-400 mb-4">
              Powered by {verification.poweredBy}
            </p>

            {/* Button */}
            <Button
              onClick={() => setIdVerificationsModal(true)}
              className="w-full rounded-xl"
            >
              {verification.buttonText}
            </Button>
          </div>
        ))}
      </div>
      <IDVerificationModal
        onClose={() => {
          setIdVerificationsModal(false);
        }}
        isOpen={idVerificationModal}
      />
    </div>
  );
}
