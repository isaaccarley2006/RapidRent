"use client";

import { ErrorMessage, useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoLogoGoogle } from "react-icons/io";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Link } from "react-router-dom";

export default function OnboardingStep2() {
  const formik = useFormikContext();

  return (
    <OnboardingLayout>
      <div className="max-w-md w-full mx-auto">
        <div className=" flex flex-col mb-8 ">
          <h2 className="text-3xl font-semibold pb-2 font-plus-jakarta-sans text-gray-900">
            Create your account
          </h2>
          <p className="text-slate-500 font-inter text-sm">
            Create your account and start your journey today.
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="font-inter">
            <label className="block text-sm font-inter font-normal text-black mb-2">
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

            <ErrorMessage
              component={"p"}
              name="email"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="">
            <label className="block text-sm font-normal font-inter text-black mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Your password"
              {...formik.getFieldProps("password")}
              className={`w-full  ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
            />

            <ErrorMessage
              component={"p"}
              name="password"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <Button
            onClick={() => formik.handleSubmit()}
            className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
          >
            Continue
          </Button>
        </div>
        <div className="text-center text-xs text-gray-500 my-4">OR</div>

        <Button variant="outline" className="w-full mb-6 ">
          <IoLogoGoogle />
          Continue with Google
        </Button>

        <div className="text-center text-xs font-inter text-gray-500">
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-orange-500 font-medium hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-8 text-xs font-inter text-gray-500 text-center">
          By creating an account, you agree to the <br />
          <span className="underline">Terms of Service</span> and{" "}
          <span className="underline">Privacy Policy</span>
        </div>
      </div>
    </OnboardingLayout>
  );
}
