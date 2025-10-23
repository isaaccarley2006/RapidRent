"use client";

import { ErrorMessage, useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function OnboardingStep4() {
  const formik = useFormikContext();

  return (
    <OnboardingLayout>
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-2xl font-plus-jakarta-sans text-center font-semibold mb-8 text-black">
          Tell us about yourself
        </h2>

        <div className="space-y-4 mb-6 font-poppins">
          <div className="grid grid-cols-2 gap-4">
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

              <ErrorMessage
                component={"p"}
                name="firstName"
                className="text-red-500 text-sm mt-1"
              />
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

              <ErrorMessage
                component={"p"}
                name="lastName"
                className="text-red-500 text-sm mt-1"
              />
            </div>
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

            <ErrorMessage
              component={"p"}
              name="phone"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* <div>
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
            /> */}

          <div className="space-y-2">
            <label htmlFor="citizenshipStatus" className="text-sm">
              Citizenship or Visa Status
            </label>
            <Select
              value={formik.values.citizenshipStatus}
              onValueChange={(value) =>
                formik.setFieldValue("citizenshipStatus", value)
              }
            >
              <SelectTrigger
                id="citizenshipStatus"
                className="w-full border border-gray-300"
              >
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="uk_citizen">UK Citizen</SelectItem>
                <SelectItem value="irish_citizen">Irish Citizen</SelectItem>
                <SelectItem value="eu_settled">
                  EU/EEA Citizen – Settled Status
                </SelectItem>
                <SelectItem value="eu_pre_settled">
                  EU/EEA Citizen – Pre-Settled Status
                </SelectItem>
                <SelectItem value="skilled_worker">
                  Skilled Worker Visa
                </SelectItem>
                <SelectItem value="student_visa">Student Visa</SelectItem>
                <SelectItem value="graduate_visa">Graduate Visa</SelectItem>
              </SelectContent>
            </Select>

            <ErrorMessage
              component={"p"}
              name="address"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <Button
            onClick={() => formik.handleSubmit()}
            className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
          >
            Create Account
          </Button>
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
