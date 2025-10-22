import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import idnowLogo from "@/assets/idnow-logo.png";

export const IdentificationCard: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus();

  const getStatusIcon = () => {
    if (verificationState.identity_verified)
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (verificationState.comprehensive_verification_status === "in_progress")
      return <Clock className="w-5 h-5 text-amber-500" />;
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = () => {
    if (verificationState.identity_verified)
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Verified
        </Badge>
      );
    if (verificationState.comprehensive_verification_status === "in_progress")
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          In Progress
        </Badge>
      );
    return <Badge variant="secondary">Not Started</Badge>;
  };

  return (
    <Card className="h-full bg-white border border-gray-200 hover:shadow transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-text-primary">
                Identity Check
              </CardTitle>
              <p className="text-sm text-text-muted">Photo ID verification</p>
            </div>
          </div>
          {getStatusIcon()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Status
            </span>
            {getStatusBadge()}
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
            <span>Powered by</span>
            <img src={idnowLogo} alt="IDnow" className="h-4 object-contain" />
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary-dark text-white"
            disabled={verificationState.identity_verified}
          >
            {verificationState.identity_verified
              ? "Verified"
              : "Verify Identity"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
