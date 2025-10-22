"use client";

import type React from "react";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { step5ValidationSchema } from "@/components/onboarding/validation-schemas";

interface Step5Props {
  onNext: () => void;
}

export default function Step5({ onNext }: Step5Props) {
  const formik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema: step5ValidationSchema,
    onSubmit: (values) => {
      console.log("[v0] Step 5 submitted:", values);
      onNext();
    },
  });

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
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-8 text-black text-center">
          Verify your email
        </h2>

        <form onSubmit={formik.handleSubmit} className="w-full">
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
                className={`w-16 h-16 text-center text-2xl font-bold border-2 rounded-lg ${
                  codeDigits[index]
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {formik.touched.verificationCode &&
            formik.errors.verificationCode && (
              <p className="text-red-500 text-sm text-center mb-4">
                {formik.errors.verificationCode}
              </p>
            )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
