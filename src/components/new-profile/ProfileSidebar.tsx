import IDVerificationModal from "@/components/new-profile/IdVerificationModal";
import { Settings, FileText, Shield, Bell, Sliders, Icon } from "lucide-react";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function ProfileSidebar({
  activeMenu,
  setActiveMenu,
}: SidebarProps) {
  const [idVerificationModal, setIdVerificationsModal] = useState(false);
  const generalSettings = [
    {
      id: "profile-settings",
      label: "Profile Settings",
      icon: Settings,
      onClick: () => setIdVerificationsModal(false),
    },
    { id: "my-contracts", label: "My Contracts", icon: FileText },
    { id: "verification-center", label: "Verification Center", icon: Shield },
  ];

  const systemSettings = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preference", label: "Preference", icon: Sliders },
  ];

  const routes = [
    {
      title: "General Settings",
      routes: generalSettings,
    },
    {
      title: "System",
      routes: systemSettings,
    },
  ];

  return (
    <div className="w-64 space-y-2 bg-white border rounded-xl border-gray-200 p-4 sticky mt-6 self-start">
      {routes?.map((route, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-sm font-poppins text-gray-400 px-4">
            {route.title}
          </h3>
          <div className="space-y-2">
            {route.routes.map((item) => (
              <NavItem
                activeMenu={activeMenu}
                item={item}
                setActiveMenu={setActiveMenu}
                key={item.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const NavItem = ({ item, setActiveMenu, activeMenu }) => {
  const Icon = item.icon;
  return (
    <>
      <button
        key={item.id}
        onClick={() => setActiveMenu(item.id)}
        className={`w-full flex items-center font-poppins justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          activeMenu === item.id
            ? "bg-gray-100 text-gray-900"
            : "text-[#727272] hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span>{item.label}</span>
        </div>

        {activeMenu === item.id && (
          <IoIosArrowForward className="text-gray-900" />
        )}
      </button>
    </>
  );
};
