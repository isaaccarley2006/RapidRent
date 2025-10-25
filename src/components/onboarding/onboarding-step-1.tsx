"use client";

import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import { useFormikContext } from "formik";

export default function OnboardingStep1() {
  const { setFieldValue, values, handleSubmit } = useFormikContext();
  const handleSelect = async (userType: string) => {
    await setFieldValue("userType", userType);
    setTimeout(() => {
      handleSubmit();
    }, 300);
  };
  return (
    <OnboardingLayout>
      <div className="w-full  ">
        <div className=" flex flex-col mb-12 ">
          <h2 className="text-3xl font-semibold pb-2 font-plus-jakarta-sans text-gray-900">
            What describes you best?
          </h2>
          <p className="text-slate-500 font-inter text-sm">
            Choose the option that fits you to get started
          </p>
        </div>

        <div className="grid  gap-8">
          {[
            {
              title: "I'm a renter",
              content: "Find houses",
              select: "renter",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyxcUi6pArXxiTXzpdiLIpFUsLGoMbPlxbIg&s",
            },
            {
              title: "I'm an agency",
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
              {/* <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.select}
                  className="object-cover absolute top-0 right-0 left-0 bottom-0"
                />
              </div> */}
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
    </OnboardingLayout>
  );
}
