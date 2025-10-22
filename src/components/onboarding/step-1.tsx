"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { step1ValidationSchema } from "@/components/onboarding/validation-schemas";
import { IoLogoGoogle } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: step1ValidationSchema,
    onSubmit: (values) => {
      console.log("[v0] Step 1 submitted:", values);
      onNext();
    },
  });

  return (
    <div className="w-full h-full  rounded-lg shadow-lg overflow-hidden">
      <div className="grid h-full grid-cols-2 gap-0">
        {/* Left Side - Form */}
        <div className="p-12 max-w-md w-full mx-auto items-center flex flex-col justify-center">
          <div className="mb-8 ">
            <h1 className="text-2xl font-bold">
              <span className="text-black">Rapid</span>
              <span className="text-orange-500">Rent</span>
            </h1>
          </div>

          <h2 className="text-2xl font-plus-jakarta-sans font-semibold mb-8 text-black">
            Create your account
          </h2>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 mb-6 w-full"
          >
            <div className="font-poppins">
              <label className="block text-sm  font-normal text-black mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="Your email address"
                {...formik.getFieldProps("email")}
                className={`w-full ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-normal text-black mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Your password"
                {...formik.getFieldProps("password")}
                className={`w-full ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
            >
              Continue
            </Button>
          </form>

          <div className="text-center text-xs text-gray-400 mb-4">OR</div>

          <Button
            variant="outline"
            className="w-full  bg-white text-black hover:bg-white/60 hover:text-black border-none font-semibold rounded-xl py-2  mb-6 "
          >
            <IoLogoGoogle />
            Continue with Google
          </Button>

          <div className="text-center text-xs font-poppins text-gray-400">
            Already have an account?{" "}
            <span className="text-orange-500 font-medium hover:underline cursor-pointer">
              Sign in
            </span>
          </div>

          <div className="mt-8 text-xs font-poppins text-gray-400 text-center">
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
