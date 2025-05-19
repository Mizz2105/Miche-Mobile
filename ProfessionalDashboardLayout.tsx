import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, Briefcase, CreditCard, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon, text, to, active }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
        active && "bg-brand-bronze/10 text-brand-bronze font-medium"
      )}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

interface ProfessionalDashboardLayoutProps {
  children: ReactNode;
}

const ProfessionalDashboardLayout = ({ children }: ProfessionalDashboardLayoutProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border shadow-sm sticky top-24">
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg text-gray-900">Dashboard</h2>
                </div>
                <div className="p-2">
                  <nav className="space-y-1">
                    <SidebarItem 
                      icon={<Calendar size={20} />} 
                      text="Calendar" 
                      to="/dashboard/professional/calendar" 
                      active={pathname.includes("/calendar")}
                    />
                    <SidebarItem 
                      icon={<Users size={20} />} 
                      text="Clients" 
                      to="/dashboard/professional/clients" 
                      active={pathname.includes("/clients")}
                    />
                    <SidebarItem 
                      icon={<Briefcase size={20} />} 
                      text="Services" 
                      to="/dashboard/professional/services" 
                      active={pathname.includes("/services")}
                    />
                    <SidebarItem 
                      icon={<CreditCard size={20} />} 
                      text="Payments" 
                      to="/dashboard/professional/payments" 
                      active={pathname.includes("/payments")}
                    />
                    <div className="pt-4 mt-4 border-t">
                      <SidebarItem 
                        icon={<Settings size={20} />} 
                        text="Settings" 
                        to="/dashboard/professional/settings" 
                        active={pathname.includes("/settings")}
                      />
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfessionalDashboardLayout; 