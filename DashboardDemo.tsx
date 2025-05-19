import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Explicitly use named export and also export as default
export const DashboardDemo: React.FC = () => {
  console.log("DashboardDemo component loaded");
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 sm:mb-8">Dashboard Demo</h1>
          
          <div className="max-w-xl mx-auto">
            <p className="text-gray-600 mb-8 sm:mb-10">
              Choose a dashboard to view with demo data
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-brand-bronze/20 hover:shadow-lg transition-shadow">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Client Dashboard</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  View appointment history, upcoming services, and spending information
                </p>
                <Link to="/dashboard/client?demo=true">
                  <Button className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white">
                    View Client Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-brand-bronze/20 hover:shadow-lg transition-shadow">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Professional Dashboard</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Manage appointments, clients, and your availability schedule
                </p>
                <Link to="/dashboard/professional?demo=true">
                  <Button className="w-full bg-brand-silver hover:bg-brand-silver/80 text-black">
                    View Pro Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 p-3 sm:p-4 bg-gray-50 rounded-md text-left">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Note:</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                These dashboards use mock data for demonstration purposes. In production,
                they will display real user data from your Supabase database.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardDemo; 