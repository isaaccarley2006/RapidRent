import { MdOutlineHomeWork } from "react-icons/md";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: MdOutlineHomeWork,
      title: "Smart Matching",
      description:
        "We provide expert guidance and support to help you secure the best mortgage rates and terms.",
      contentItems: [
        "Our AI recommends properties you’re already eligible for, based on your verified profile and preferences.",
        "Only see listings you can actually rent",
        "Save time on unsuitable applications",
        "Personalised guidance through every step",
      ],
    },
    {
      icon: MdOutlineHomeWork,
      title: "Guarantor Services",
      description:
        "We offer comprehensive services to sell your property quickly and at the best price.",
      contentItems: [
        "If you need a guarantor, we’ll connect you with trusted options and verify them for you.",
        "Approval-ready applications",
        "No delays from missing paperwork",
        "Peace of mind for both tenants and landlords",
      ],
    },
    {
      icon: MdOutlineHomeWork,
      title: "Tenant Communities",
      description:
        "Our property management services ensure that your investment is well-maintained and profitable.",
      contentItems: [
        "Join local groups to connect with other renters, find flatmates, or discover homes together.",
        "Build connections before you move",
        "Share rentals or join verified groups",
        "Feel supported through the process",
      ],
    },
    {
      icon: MdOutlineHomeWork,
      title: "Contract & Signing",
      description:
        "Our investment consultants provide expert advice and strategic planning to help you build.",
      contentItems: [
        "Once you’ve found your place, finalise the contract right on RapidRent. Digital signing. Faster move-ins. Clear, transparent agreements between all parties. Trust the process.",
      ],
    },
    {
      icon: MdOutlineHomeWork,
      title: "One Dashboard",
      description:
        "Our market analysis services provide you with detailed insights into current market trends.",
      contentItems: [
        "Track every step of your rental journey in one place – from search to signed contract.Less admin, fewer surprises. Total control over your rental process. Centralised control and transparency.Real-time updates for everyone. Smarter, faster decisions powered by data",
        "For tenants: View offers, saved properties, preferences, referencing status (active 60 days), and rental history – all tracked in real time.",
        "For agents: Manage listings, analytics and market insights, viewings, offers and conversion tracking, and contract management and account health with personalised performance tips. Use built-in market data and analysis to make smarter, faster decisions.",
      ],
    },
    {
      icon: MdOutlineHomeWork,
      title: "AI Experience",
      description:
        "Our home stategin services enhace the appeal of your property, making it more attractive.",
      contentItems: [
        "Our intelligent system simplifies every step with tailored guidance and real-time insights",
        "Step-by-step onboarding through the rental process",
        "Smart alerts, reminders, and document guidance",
        "A personalised experience that adapts to your situation",
      ],
    },
  ];

  return (
    <section className=" py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h6 className=" uppercase font-plus-jakarta-sans text-gray-500 mb-6 text-sm">
          Our Services
        </h6>
        <div className="grid grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard index={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value={`item-${index}`}
          className=" border-none  rounded-2xl"
        >
          <AccordionTrigger className="hover:no-underline ">
            <div className="flex gap-4 justify-center items-center ">
              <div className="bg-accent text-white p-4 rounded-full">
                <service.icon size={22} />
              </div>

              <div>
                <div className="text-xl mb-2 text-start  font-plus-jakarta-sans font-semibold text-gray-900">
                  {service.title}
                </div>
                <div className="text-muted-foreground text-start font-normal text-sm font-poppins">
                  {service.description}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex  gap-4">
              <div>
                <div className="bg-transparent text-white p-4 rounded-full">
                  <service.icon size={22} />
                </div>
              </div>
              <div>
                <ul className="text-gray-800 space-y-4 text-start font-normal text-sm font-poppins">
                  {service.contentItems.map((content) => (
                    <li className="text-base flex items-start gap-2">
                      <Check
                        size={18}
                        className="text-accent mt-2 text-[2px]"
                      />

                      <div className="flex-1"> {content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
  return (
    <motion.div
      key={index}
      className="bg-white p-8 flex flex-col gap-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
    >
      <div className="flex">
        <div className="bg-accent text-white p-4 rounded-full">
          <service.icon size={22} />
        </div>
      </div>
      <h3 className="text-xl font-plus-jakarta-sans font-bold text-gray-900">
        {service.title}
      </h3>
      <p className="text-gray-500 text-sm font-poppins">
        {service.description}
      </p>
    </motion.div>
  );
};
