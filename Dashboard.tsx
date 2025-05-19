import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth, api } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"client" | "professional" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const determineUserType = async () => {
      try {
        console.log("Dashboard: Determining user type...");
        const user = await auth.getUser();
        
        if (!user) {
          console.log("Dashboard: No user found");
          setUserType(null);
          setIsLoading(false);
          return;
        }
        
        console.log("Dashboard: User found", user);
        setUserId(user.id);
        // Store user email for profile creation if needed
        const userEmail = user.email;
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
        }
        
        // Fetch the user's profile to determine their type
        try {
          const profile = await api.getUserProfile(user.id);
          
          if (profile) {
            console.log("Dashboard: Profile found with type", profile.type);
            setUserType(profile.type);
          } else {
            console.log("Dashboard: No profile found for user");
            setError("Your account is authenticated but no profile was found. Please create a profile to continue.");
            setUserType(null);
          }
        } catch (profileError) {
          console.error("Dashboard: Error fetching profile:", profileError);
          setError("There was an error fetching your profile. Please try again or contact support.");
          setUserType(null);
        }
      } catch (error) {
        console.error("Dashboard: Error determining user type:", error);
        setError("There was an error authenticating your account. Please try logging in again.");
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    determineUserType();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-bronze" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-6">Account Setup Required</h1>
            
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-brand-bronze/20">
              <p className="text-red-600 mb-6">{error}</p>
              
              <p className="mb-6">
                To continue, please select the type of account you'd like to create:
              </p>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white"
                  onClick={async () => {
                    try {
                      if (userId) {
                        // Create a client profile
                        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
                        await api.createClientProfile({
                          first_name: "New",
                          last_name: "User",
                          email: userEmail,
                          phone: "",
                          username: `user_${Date.now()}`,
                        });
                        window.location.reload();
                      }
                    } catch (error) {
                      console.error("Error creating client profile:", error);
                    }
                  }}
                >
                  Create Client Account
                </Button>
                
                <Link to="/join-as-pro">
                  <Button className="w-full bg-brand-silver hover:bg-brand-silver/80 text-black">
                    Create Professional Account
                  </Button>
                </Link>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        await auth.signOut();
                        window.location.href = "/login";
                      } catch (error) {
                        console.error("Error signing out:", error);
                      }
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (userType === "client") {
    return <Navigate to="/dashboard/client" replace />;
  }

  if (userType === "professional") {
    return <Navigate to="/dashboard/professional" replace />;
  }

  // If we can't determine the user type, redirect to login
  return <Navigate to="/login" replace />;
};

export default Dashboard; 