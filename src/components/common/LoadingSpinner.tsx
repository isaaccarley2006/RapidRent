import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
};
