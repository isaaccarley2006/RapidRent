"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { step2ValidationSchema } from "@/components/onboarding/validation-schemas";

interface Step2Props {
  onNext: () => void;
}

export default function Step2({ onNext }: Step2Props) {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    validationSchema: step2ValidationSchema,
    onSubmit: (values) => {
      console.log("[v0] Step 2 submitted:", values);
      onNext();
    },
  });

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-2 gap-0">
        {/* Left Side - Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              <span className="text-black">Rapid</span>
              <span className="text-orange-500">Rent</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-black">
            Tell us about yourself
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
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
              <label className="block text-sm font-semibold text-black mb-2">
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
              <label className="block text-sm font-semibold text-black mb-2">
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
              <label className="block text-sm font-semibold text-black mb-2">
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
                <label className="block text-sm font-semibold text-black mb-2">
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
                <label className="block text-sm font-semibold text-black mb-2">
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
              <label className="block text-sm font-semibold text-black mb-2">
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
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-xs text-gray-500 text-center">
            By creating an account, you agree to the <br />
            Terms of Service and Privacy Policy
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="bg-gray-50 p-12 flex flex-col justify-center">
          <div className="text-right mb-4">
            <span className="text-sm text-orange-500 font-semibold cursor-pointer">
              Want to learn more? Schedule a demo
            </span>
          </div>

          <h3 className="text-3xl font-bold mb-8 text-black">
            Smart. Secure.{" "}
            <span className="text-orange-500">Stress-Free Renting</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Find and apply for homes in minutes, not days
              </span>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Verified listings and background-checked landlords
              </span>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                AI-powered match system for your ideal home
              </span>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Paperless, and hassle-free</span>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-600 mb-4">
              Powered by industry leading companies
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-black">amazon</span>
              <span className="text-sm font-semibold text-black">GOV.UK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
