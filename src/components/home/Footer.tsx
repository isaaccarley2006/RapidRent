import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className=" font-plus-jakarta-sans ">
      <div className="bg-accent text-white px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-12">
            {/* Left Section - Address and Social */}
            <div className=" flex-[2] flex flex-col justify-between">
              <div className="mb-8">
                <p className="text-sm font-medium mb-1">
                  123 Main Street, Hampstead, USA
                </p>
                <p className="text-sm font-medium">(123) 456-7890</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:opacity-80 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="hover:opacity-80 transition">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:opacity-80 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:opacity-80 transition">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {[
              {
                title: "Benefits",
                links: [
                  {
                    label: "Offices",
                    route: "/offices",
                  },
                  {
                    label: "Services",
                    route: "/services",
                  },
                  {
                    label: "Testimonials",
                    route: "/testimonials",
                  },
                  {
                    label: "Newsletter",
                    route: "/newsletter",
                  },
                ],
              },
              {
                title: "Home",
                links: [
                  {
                    label: "About us",
                    route: "/about",
                  },
                  {
                    label: "Listings",
                    route: "/listings",
                  },
                  {
                    label: "Agents",
                    route: "/agents",
                  },
                ],
              },
            ].map((route, index) => (
              <div className="flex-1" key={index}>
                <h4 className="font-bold mb-6 text-base">{route.title}</h4>
                <ul className="space-y-3 text-sm">
                  {route?.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.route}
                        className="hover:opacity-80 transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Spacer for layout */}
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>
    </footer>
  );
  return (
    <footer className="bg-white  font-plus-jakarta-sans text-sm border-muted  ">
      <div className="max-w-7xl mx-auto bg-gray-200/40 py-10 px-6 rounded-t-3xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8 px-10">
          <div>
            <div className="text-2xl font-bold text-text-primary mb-4">
              Rapid<span className="text-primary">Rent</span>
            </div>
            <p className="text-text-muted">
              Making rental property search simple and transparent for everyone.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">
              For Tenants
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/listings")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Browse Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/auth")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Create Account
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Tenant Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">
              For Landlords
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/auth")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  List Property
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Landlord Tools
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/legal/privacy")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/legal/terms")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/legal/cookies")}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted pt-8 text-center text-text-muted">
          <p>&copy; 2024 RapidRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
