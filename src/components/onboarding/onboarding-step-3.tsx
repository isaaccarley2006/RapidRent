"use client";

import type React from "react";

import { ErrorMessage, useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingStep3() {
  const formik = useFormikContext();

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1 || !/^[0-9]*$/.test(value)) return;

    const currentCode = formik.values.verificationCode.split("");
    currentCode[index] = value;
    const newCode = currentCode.join("");

    formik.setFieldValue("verificationCode", newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !formik.values.verificationCode[index] &&
      index > 0
    ) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const codeDigits = formik.values.verificationCode.split("");

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-medium mb-12  font-poppins text-center text-black">
          Verify your email
        </h2>
        <div className="w-full">
          <div className="flex gap-4 mb-8 justify-center">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                id={`digit-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={codeDigits[index] || ""}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="0"
                className={`w-16 h-16 text-center md:text-xl  font-plus-jakarta-sans border rounded-lg ${
                  codeDigits[index]
                    ? "border-orange-500 bg-orange-50 "
                    : "border-gray-300 "
                }`}
              />
            ))}
          </div>

          <ErrorMessage
            component={"p"}
            name="verificationCode"
            className="text-red-500 text-sm text-center mb-8"
          />

          <div className="max-w-[240px] w-full mx-auto">
            <Button
              onClick={() => formik.handleSubmit()}
              className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
