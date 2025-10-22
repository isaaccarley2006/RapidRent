import ProfileSidebar from "@/components/new-profile/ProfileSidebar";
import VerificationCenter from "@/components/new-profile/VerificationCenter";
import React, { useState } from "react";

export default function NewProfile() {
  const [activeMenu, setActiveMenu] = useState("profile-settings");

  const renderContent = () => {
    switch (activeMenu) {
      case "profile-settings":
        return <div className="p-8">profile-settings</div>;
      case "my-contracts":
        return <div className="p-8">my-contracts</div>;
      case "verification-center":
        return <VerificationCenter />;
      case "notifications":
        return <div className="p-8">Notifications content</div>;
      case "preference":
        return <div className="p-8">Preference content</div>;
      default:
        return <div className="p-8">Notifications content</div>;
    }
  };

  return (
    <div className="min-h-screen relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden bg-white  flex">
      <ProfileSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
