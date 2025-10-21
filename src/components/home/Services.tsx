import { MdOutlineHomeWork } from "react-icons/md";

export default function Services() {
  const services = [
    {
      icon: MdOutlineHomeWork,
      title: "Buying a home",
      description:
        "We provide expert guidance and support to help you secure the best mortgage rates and terms.",
    },
    {
      icon: MdOutlineHomeWork,
      title: "Selling your property",
      description:
        "We offer comprehensive services to sell your property quickly and at the best price.",
    },
    {
      icon: MdOutlineHomeWork,
      title: "Property management",
      description:
        "Our property management services ensure that your investment is well-maintained and profitable.",
    },
    {
      icon: MdOutlineHomeWork,
      title: "Investment consultation",
      description:
        "Our investment consultants provide expert advice and strategic planning to help you build.",
    },
    {
      icon: MdOutlineHomeWork,
      title: "Market analysis",
      description:
        "Our market analysis services provide you with detailed insights into current market trends.",
    },
    {
      icon: MdOutlineHomeWork,
      title: "Home staging",
      description:
        "Our home stategin services enhace the appeal of your property, making it more attractive.",
    },
  ];

  return (
    <section className=" py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h6 className=" uppercase font-plus-jakarta-sans text-gray-500 mb-6 text-sm">
          Our Services
        </h6>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 flex flex-col gap-4 rounded-lg "
            >
              <div className="flex">
                <div className=" bg-accent text-white p-4 rounded-full">
                  <service.icon size={22} />
                </div>
              </div>
              <h3 className="text-xl font-plus-jakarta-sans font-bold text-gray-900 ">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm font-poppins">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
