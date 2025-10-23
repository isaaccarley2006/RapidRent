import type React from "react";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export default function ProfileSettings() {
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
    <div className="flex-1 p-8 pr-0 ">
      {/* Warning Banner */}
      <div className="mb-6 bg-yellow-400 rounded-xl  p-4 flex items-center gap-3">
        <div className="text-white text-xl">⚠</div>
        <div className="text-white">
          <p className="font-poppins">
            Complete your verification to finalize your rental profile.
          </p>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white font-poppins rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-medium text-gray-900 ">Account</h2>
        <p className="text-gray-400 text-sm mb-8">
          Real-time information and activities of your property.
        </p>

        {/* Profile Card */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Sophia Williams
              </h3>
              <p className="text-gray-400">sophiawilliams@gmail.com</p>
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
              <span className="text-sm font-medium">Delete</span>
            </Button>
          </div>
        </div>
        <div className="bg-[#FAFAFA] p-4 border border-gray-200 rounded-xl">
          {/* Personal Information Section */}
          <Formik
            initialValues={{
              firstName: "Sophia",
              lastName: "Williams",
              email: "sophiawilliams@gmail.com",
              phone: "247-00 24574",
            }}
            validationSchema={profileValidationSchema}
            onSubmit={(values) => {
              console.log("Profile updated:", values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-8 space-y-4 ">
                  <h3 className="text-lg  text-gray-900">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm  text-gray-900 mb-2">
                        First Name
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      <Field
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>

          {/* Password Section */}
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={(values) => {
              console.log("Password updated:", values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-8 pb-8 border-b border-gray-200 space-y-4">
                  <div>
                    <h3 className="text-lg  text-gray-900 mb-2">Password</h3>
                    <p className="text-gray-400 text-sm">
                      Manage your current password
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm text-gray-900 mb-2">
                        New password
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          name="newPassword"
                          placeholder="Password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-900 mb-2">
                        Re-enter password
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="w-full px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="rounded-xl">
                    Save Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Account Security Section */}
          <div className="space-y-4 mb-4  flex justify-between items-center">
            <div className="">
              <h3 className="text-lg  text-gray-900 mb-2">Account security</h3>
              <p className="text-gray-400 text-sm">
                Manage your Account security
              </p>
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
        </div>
      </div>
    </div>
  );
}
