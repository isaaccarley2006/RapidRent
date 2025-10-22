"use client";

import { useFormikContext } from "formik";
import { useState } from "react";

export default function OnboardingStep1() {
  const { setFieldValue, values, handleSubmit } = useFormikContext();
  const handleSelect = async (userType: string) => {
    await setFieldValue("userType", userType);
    setTimeout(() => {
      handleSubmit();
    }, 300);
  };
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Rapid</span>
          <span className="text-orange-500">Rent</span>
        </h1>
      </div>

      <h2 className="text-3xl font-medium mb-12  font-poppins text-center text-black">
        What describes you best?
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {[
          {
            title: "I'm a renter",
            content: "Find houses",
            select: "renter",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyxcUi6pArXxiTXzpdiLIpFUsLGoMbPlxbIg&s",
          },
          {
            title: "I'm an agencys",
            content: "Post houses",
            select: "agency",
            img: "https://www.investopedia.com/thmb/7wgojDk9aYsQ0wFEMlXJWsP3vyo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2155192216-fd6d700a3a4c46a49f17bb5911f2788c.jpg",
          },
        ].map((item: any, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item.select)}
            className={`cursor-pointer rounded-2xl border overflow-hidden transition-all ${
              values.userType === item.select
                ? "ring-2 ring-orange-500"
                : "hover:shadow"
            }`}
          >
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <img
                src={item.img}
                alt={item.select}
                className="object-cover absolute top-0 right-0 left-0 bottom-0"
              />
            </div>
            <div className="p-6 text-center bg-white">
              <h3 className="text-md font-normal font-poppins text-black mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
