import type React from "react";
import { FolderOpen, TrendingUp, Shield, User, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IDVerificationModal from "@/components/new-profile/IdVerificationModal";
import { IMAGES } from "@/assets";

interface VerificationCard {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "verified";
  icon: React.ReactNode;
  poweredByImg: string;
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
      poweredByImg: IMAGES.EXPERIAN_LOGO,
      buttonText: "Verify Credit",

      onClick: () => setIdVerificationsModal(true),
    },
    {
      id: "income-verification",
      title: "Income Verification",
      description: "Employment & earnings",
      status: "not-started",
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      poweredByImg: IMAGES.PLAID_LOGO,
      buttonText: "Verify Income",
    },
    {
      id: "right-to-rent",
      title: "Right to Rent",
      description: "Legal status verification",
      status: "not-started",
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      poweredByImg: IMAGES.IDNOW_LOGO,
      buttonText: "Verify Right to Rent",
    },
    {
      id: "identity-check",
      title: "Identity Check",
      description: "Photo ID verification",
      status: "verified",
      icon: <User className="w-8 h-8 text-orange-500" />,
      poweredByImg: IMAGES.IDNOW_LOGO,
      buttonText: "Verified",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 ">
        {verifications.map((verification) => (
          <div
            key={verification.id}
            className="col-span-1 font-poppins rounded-xl border border-gray-200 p-6
bg-white hover:bg-gradient-to-t hover:from-accent/10 hover:to-white
hover:shadow-md transition-all duration-500 ease-in-out"
          >
            {/* Header with icon and info button */}
            <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
              <div className="flex items-start gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-500 bg-accent/10 hover:bg-accent/10 hover:text-gray-600"
                >
                  {verification.icon}
                </Button>
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    {verification.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {verification.description}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-500 hover:bg-slate-400/10 hover:text-slate-600"
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
            <p className="text-xs text-center items-center flex gap-2 justify-center  text-slate-500 mb-4">
              <span> Powered by </span>
              <img
                src={verification.poweredByImg}
                alt="Experian"
                className="h-4 object-contain"
              />
            </p>

            {/* Button */}
            <Button
              onClick={() => setIdVerificationsModal(true)}
              className="w-full rounded-xl "
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
