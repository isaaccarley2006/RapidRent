import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { IMAGES } from "@/assets";
export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className=" bg-gray-100/5 border max-w-7xl w-full mx-auto  mb-4   rounded-3xl">
      <footer
        className=" text-white   py-10  "
        style={{ opacity: 1, transform: "none" }}
      >
        <div className="container mx-auto font-outfit">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div style={{ opacity: 1, transform: "none" }}>
              <Link
                to={"/"}
                className="flex items-center gap-2 mb-4 font-medium"
              >
                <img className="w-8" src={IMAGES.LOGO_PRIMARY} />
                <h1 className="text-2xl font-semibold">
                  <span className="text-black">Rapid </span>
                  <span className="text-accent">Rent</span>
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground font-inter">
                3 Garden Walk ,Shoreditch,
                <br /> London,EC2A 3EQ
              </p>
            </div>

            {[
              {
                title: "Home",
                links: [
                  {
                    label: "Listings",
                    route: "/listings",
                  },
                  {
                    label: "Communities",
                    route: "/communities",
                  },
                ],
              },
              {
                title: "Company",
                links: [
                  {
                    label: "About",
                    route: "/about",
                  },
                  {
                    label: "Contact Us",
                    route: "/",
                  },
                  {
                    label: "Policy",
                    route: "/",
                  },
                  {
                    label: "Terms and Conditions",
                    route: "/",
                  },
                ],
              },
            ].map((route, index) => (
              <div key={index} style={{ opacity: 1, transform: "none" }}>
                <h3 className="text-lg font-plus-jakarta-sans font-semibold mb-4 text-accent">
                  {route.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {route?.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.route}
                        className="hover:underline hover:text-accent text-gray-900 transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ opacity: 1, transform: "none" }}>
              <h3 className="text-lg font-semibold mb-4 text-accent">
                Follow Us
              </h3>
              <div className="flex gap-4 text-black/60 ">
                <a
                  href="#"
                  className="hover:opacity-80 hover:text-accent  transition"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 hover:text-accent transition"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 hover:text-accent transition"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 hover:text-accent transition"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="flex rounded-b-xl flex-col mt-8 py-4 gap-2 sm:flex-row  w-full shrink-0 items-center bg-accent px-4 md:px-6 border-t">
        <p className="text-xs text-white ">
          ©&nbsp;{new Date().getFullYear()}&nbsp;
          <a className="underline font-semibold font-outfit " href="/">
            RapidRent
          </a>
          . All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 text-white font-outfit sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </div>
    </div>
  );
};
