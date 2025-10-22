"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CheckCircle } from "lucide-react";
import { IMAGES } from "@/assets";
import { Button } from "@/components/ui/button";

interface IDVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  idMethod: Yup.string().required("Please select an ID method"),
});

export default function IDVerificationModal({
  isOpen,
  onClose,
}: IDVerificationModalProps) {
  const [step, setStep] = useState(1);

  const handleSubmit = (values: any) => {
    if (step === 2) {
      setStep(3);
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Header with progress dots */}
        <div className="px-8 pt-10 pb-4">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-0.5 w-full rounded-full ${
                  num <= step ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-8 py-8 font-poppins">
          {step === 1 && (
            <Formik
              initialValues={{
                country: "United Kingdom",
                idMethod: "passport",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched }) => (
                <Form>
                  <h2 className="text-2xl font-medium text-gray-900 mb-6">
                    Select ID type
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-900 mb-2">
                      Document Issuing Country/Region
                    </label>
                    <Field
                      as="select"
                      name="country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Australia">🇦🇺 Australia</option>
                    </Field>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-900 mb-4">
                      What method would you prefer to use?
                    </label>

                    <div className="space-y-3">
                      {[
                        {
                          value: "id-card",
                          label: "ID card",
                          icon: IMAGES.ID_VERIFICATION_2,
                        },
                        {
                          value: "passport",
                          label: "Passport",
                          icon: IMAGES.ID_VERIFICATION_1,
                        },
                        {
                          value: "drivers-license",
                          label: "Driver's license",
                          icon: IMAGES.ID_VERIFICATION_3,
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
                        >
                          <img className="w-10 h-10" src={option.icon} />
                          <span className="flex-1 text-gray-900">
                            {option.label}
                          </span>
                          <Field
                            type="radio"
                            name="idMethod"
                            value={option.value}
                            className="w-5 h-5 text-orange-500 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Facial recognition
              </h2>

              {/* Face illustration */}
              <div className="flex justify-center mb-8">
                <img className="w-32 h-32" src={IMAGES.FACIAL_RECOGNITION} />
              </div>

              <p className="text-gray-400 text-sm mb-8">
                In order to improve the success rate of face recognition, please
                follow these requirements below
              </p>

              {/* Requirements */}
              <div className="flex justify-center items-center gap-12 mb-8">
                <div className="text-center space-y-2 flex flex-col items-center">
                  <img className="w-10 h-10" src={IMAGES.ID_VERIFICATION_4} />
                  <p className="text-sm text-gray-900">Well-lit</p>
                </div>
                <div className="text-center space-y-2 flex flex-col items-center">
                  <img className="w-10 h-10" src={IMAGES.ID_VERIFICATION_5} />
                  <p className="text-sm text-gray-900">Don't occluded face</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Verified
              </h2>

              {/* Success illustration */}
              <div className="flex justify-center mb-8">
                <img className="w-32 h-32" src={IMAGES.ID_VERIFICATION_6} />
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-8 py-6 border-t border-gray-200 flex gap-3">
          <Button
            onClick={handleClose}
            variant="secondary"
            className=" border w-full border-gray-300 bg-gray-50 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {step === 3 ? "Close" : "Cancel"}
          </Button>
          {step !== 3 && (
            <Button
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else if (step === 2) {
                  setStep(3);
                }
              }}
              className=" w-full rounded-xl font-medium transition-colors"
            >
              {step === 2 ? "Attach File" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
