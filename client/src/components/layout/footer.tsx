import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Phone, Shield } from "lucide-react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "Get Help Now", href: "/chat" },
    { name: "Resources", href: "/resources" },
    { name: "Community", href: "/community" },
    { name: "Volunteer", href: "/volunteer" },
  ];

  const emergencyContacts = [
    { name: "Crisis Hotline", number: "988", urgent: true },
    { name: "Emergency Services", number: "911", urgent: true },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Safety Guidelines", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-trust-blue rounded-lg flex items-center justify-center mr-3">
                <Heart className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">HealNet</h3>
                <p className="text-gray-400 text-sm">Safe Support Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Creating a safe, confidential space for abuse survivors to access support,
              resources, and healing guidance.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <FaTwitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="font-semibold mb-4">Quick Access</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <button className="text-gray-300 hover:text-white transition-colors text-left">
                      {link.name}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.name}
                  className={`rounded-lg p-3 ${
                    contact.urgent
                      ? "bg-emergency-red bg-opacity-20 border border-emergency-red"
                      : "bg-gray-800"
                  }`}
                >
                  <p className="text-sm font-medium text-red-300 mb-1">{contact.name}</p>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-white font-bold hover:underline"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 HealNet. All rights reserved. Your safety and privacy are our priority.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="text-trust-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-white mb-2">Privacy & Security</h5>
              <p className="text-sm text-gray-300">
                All communications on HealNet are end-to-end encrypted and anonymous.
                We do not store personal information or track your browsing activity.
                Your safety and privacy are our highest priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
