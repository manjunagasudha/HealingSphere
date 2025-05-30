import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu, Shield } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Get Help", href: "/", icon: Heart },
    { name: "Resources", href: "/resources", icon: Shield },
    { name: "Community", href: "/community", icon: Heart },
    { name: "Volunteer", href: "/volunteer", icon: Heart },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 bg-trust-blue rounded-lg flex items-center justify-center mr-3">
                <Heart className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealNet</h1>
                <p className="text-sm text-gray-600">Safe Support Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button
                  className={`text-gray-700 hover:text-trust-blue font-medium transition-colors ${
                    isActive(item.href) ? "text-trust-blue" : ""
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            ))}
          </nav>

          {/* Security Badge */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center text-sm text-healing-green">
              <Shield className="mr-1 h-4 w-4" />
              <span className="font-medium">Secure & Anonymous</span>
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-trust-blue rounded-lg flex items-center justify-center mr-3">
                  <Heart className="text-white h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">HealNet</h2>
                  <p className="text-sm text-gray-600">Safe Support Platform</p>
                </div>
              </div>

              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-trust-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="inline mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-healing-green">
                  <Shield className="mr-2 h-4 w-4" />
                  <span className="font-medium">Secure & Anonymous</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Your privacy and safety are our top priorities
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
