import type React from "react";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdClose, MdWarning } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

// Validation schema
const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});

const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Old password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number"),
  newPassword: Yup.string().required("New password is required"),
});

export default function ProfileSettings() {
  const { user } = useAuth();
  console.log(user, "useruser");
  return (
    <div className="flex-1 p-6 pr-0 ">
      {/* Warning Banner */}
      <div className="mb-6 bg-[#ffeebb] border  text-yellow-600 border-yellow-400 rounded-xl  p-4 flex items-center gap-3">
        <PiWarningCircle size={22} />

        <div className="text-yellow-600 flex-1 ">
          <p className=" text-sm">
            Complete your verification to finalize your rental profile.
          </p>
        </div>
        <MdClose />
      </div>

      {/* Account Section */}
      <div className="bg-white font-poppins rounded-xl border border-gray-200 p-6">
        {/* Profile Card */}
        <ProfileCard user={user} />
        <ProfileTabs user={user} />
      </div>
    </div>
  );
}

const ProfileTabs = ({ user }) => {
  const tabs = [
    {
      label: "Personal Information",
      value: "personal-information",
      component: <PersonalInfo user={user} />,
    },
    {
      label: "Password",
      value: "password",
      component: <PasswordInfo />,
    },
    {
      label: "Security",
      value: "security",
      component: <AccountSecurity />,
    },
  ];
  return (
    <Tabs defaultValue="personal-information">
      <TabsList className="bg-transparent rounded-none border-b border-gray-200 w-full flex justify-start gap-6  ">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={index}
            className=" font-inter data-[state=active]:bg-transparent px-0 rounded-lg text-gray-400 font-normal data-[state=active]:text-accent data-[state=active]:shadow-none font-medium"
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className=" py-4  rounded-xl">
        {tabs.map((tab, index) => (
          <TabsContent value={tab.value}>{tab.component}</TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

const ProfileCard = ({ user }) => {
  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9zilY2Yu2hc19pDZFxgWDTUDy5DId7ITqA&s"
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-4 justify-between pb-4  border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {user?.firstName}
            </h3>
            <p className="text-slate-500 font-inter">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload new picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2  px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Delete Image</span>
          </Button>
        </div>
      </div>
    </>
  );
};
const PersonalInfo = ({ user }) => {
  return (
    <Formik
      initialValues={{
        firstName: user?.firstname,
        lastName: "",
        email: user?.email,
        phone: "247-00 24574",
      }}
      enableReinitialize
      validationSchema={profileValidationSchema}
      onSubmit={(values) => {
        console.log("Profile updated:", values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className=" space-y-4 ">
            <div>
              <h3 className="text-lg text-gray-900 font-medium font-poppins">
                Personal Information
              </h3>
              <p className="text-slate-500 text-sm">
                Manage your Personal information
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm  text-gray-900 mb-2">
                  First Name
                </label>
                <Field
                  as={Input}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm  text-gray-900 mb-2">
                  Last Name
                </label>
                <Field
                  as={Input}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Contact email
                </label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Phone Number
                </label>
                <Field as={Input} type="tel" name="phone" placeholder="Phone" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="rounded-xl">
                Save Changes
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const PasswordInfo = () => {
  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
      }}
      validationSchema={passwordValidationSchema}
      onSubmit={(values) => {
        console.log("Password updated:", values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg text-gray-900 font-medium font-poppins">
                Password
              </h3>
              <p className="text-slate-500 text-sm">
                Manage your current password
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Old password
                </label>
                <div className="relative">
                  <Field
                    as={Input}
                    type="password"
                    name="oldPassword"
                    placeholder="Password"
                  />
                </div>
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  New password
                </label>
                <div className="relative">
                  <Field
                    as={Input}
                    type="password"
                    name="newPassword"
                    placeholder="New password "
                  />
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="rounded-xl">
                Save Password
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const AccountSecurity = () => {
  return (
    <div className="space-y-4 flex justify-between items-center">
      <div className="">
        <h3 className="text-lg text-gray-900 font-medium font-poppins">
          Account security
        </h3>
        <p className="text-slate-500 text-sm">Manage your Account security</p>
      </div>
      <div className="flex gap-3">
        <Button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log out</span>
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2  px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Delete</span>
        </Button>
      </div>
    </div>
  );
};
