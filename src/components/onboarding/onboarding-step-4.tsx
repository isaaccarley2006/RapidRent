"use client";

import { useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { IoCheckmarkSharp } from "react-icons/io5";

export default function OnboardingStep4() {
  const formik = useFormikContext();

  return (
    <div className="w-full h-full  rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-2 gap-0">
        {/* Left Side - Form */}
        <div className="p-12 max-w-md w-full mx-auto items-center flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              <span className="text-black">Rapid</span>
              <span className="text-orange-500">Rent</span>
            </h1>
          </div>

          <h2 className="text-2xl font-plus-jakarta-sans font-semibold mb-8 text-black">
            Tell us about yourself
          </h2>

          <div className="space-y-4 mb-6 font-poppins">
            <div>
              <label className="block text-sm  font-normal text-black mb-2">
                First Name
              </label>
              <Input
                type="text"
                placeholder="Your first name"
                {...formik.getFieldProps("firstName")}
                className={`w-full ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm  font-normal text-black mb-2">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Your last name"
                {...formik.getFieldProps("lastName")}
                className={`w-full ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm  font-normal text-black mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="Your phone number"
                {...formik.getFieldProps("phone")}
                className={`w-full ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm  font-normal text-black mb-2">
                Address
              </label>
              <Input
                type="text"
                placeholder="Your current address"
                {...formik.getFieldProps("address")}
                className={`w-full ${
                  formik.touched.address && formik.errors.address
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm  font-normal text-black mb-2">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="Your city"
                  {...formik.getFieldProps("city")}
                  className={`w-full ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm  font-normal text-black mb-2">
                  Postal code
                </label>
                <Input
                  type="text"
                  placeholder="1234567"
                  {...formik.getFieldProps("postalCode")}
                  className={`w-full ${
                    formik.touched.postalCode && formik.errors.postalCode
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm  font-normal text-black mb-2">
                Country
              </label>
              <Input
                type="text"
                placeholder="Country"
                {...formik.getFieldProps("country")}
                className={`w-full ${
                  formik.touched.country && formik.errors.country
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.country}
                </p>
              )}
            </div>
            <Button
              onClick={() => formik.handleSubmit()}
              className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
            >
              Create Account
            </Button>
          </div>

          <div className=" text-xs font-poppins text-gray-400 text-center">
            By creating an account, you agree to the <br />
            Terms of Service and Privacy Policy
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="bg-white p-12 flex font-poppins  flex-col justify-around">
          <div className="text-right mb-4">
            <span className="text-sm text-gray-400  cursor-pointer">
              Want to learn more?{" "}
              <span className=" text-orange-500">Schedule a demo</span>
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-8 text-black">
              Smart. Secure.{" "}
              <span className="text-orange-500">Stress-Free Renting</span>
            </h3>

            <div className="space-y-4">
              {[
                "Find and apply for homes in minutes, not days",
                "Verified listings and background-checked landlords",
                "AI-powered match system for your ideal home",
                "Paperless, and hassle-free",
              ].map((content, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-accent/20 rounded p-0.5 ">
                    <IoCheckmarkSharp size={14} className="text-accent" />
                  </div>
                  <span className="text-gray-700">{content}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-400 mb-4">
              Powered by industry leading companies
            </p>
            <div className="flex items-center gap-6">
              <svg className="w-24 h-8" viewBox="0 0 24 24">
                <path fill="currentColor" d="M.5 0h24v24H.5z" opacity="0" />
                <path fill="currentColor" d="M6.5 6h11v12h-11z" opacity="0.1" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  className="text-xs font-bold fill-black"
                >
                  amazon
                </text>
              </svg>
              <span className="text-sm font-semibold text-black">GOV.UK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
