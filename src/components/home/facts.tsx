import clsx from "clsx";
import { PiSmiley } from "react-icons/pi";
import { MdOutlineHomeWork } from "react-icons/md";
import { SlBadge } from "react-icons/sl";

export default function Facts() {
  const stats = [
    {
      number: "98%",
      label:
        "With a client satisfaction rate of 98%, our commitment to exceptional service and personalized support is evident in every interaction.",
      icon: PiSmiley,
    },
    {
      number: "300+",
      label:
        "With a client satisfaction rate of 98%, our commitment to exceptional service and personalized support is evident in every interaction.",
      icon: MdOutlineHomeWork,
    },
    {
      number: "15",
      label:
        "With a client satisfaction rate of 98%, our commitment to exceptional service and personalized support is evident in every interaction.",
      icon: SlBadge,
    },
  ];

  return (
    <section className=" py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h6 className=" uppercase font-plus-jakarta-sans text-gray-500 mb-6 text-sm">
          facts
        </h6>
        <div className="flex flex-col ">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={clsx(
                "flex items-center border-b",
                index == 0 && "border-y"
              )}
            >
              <div className="flex items-center gap-10 py-12  flex-1">
                <div className=" bg-accent text-white p-4 rounded-full">
                  <stat.icon size={22} />
                </div>

                <div className="text-4xl font-plus-jakarta-sans font-semibold text-gray-900">
                  {stat.number}
                </div>
              </div>
              <p className="text-gray-400 flex-1 text-sm font-poppins">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
