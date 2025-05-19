import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { auth, api } from "@/lib/supabase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDevMenu, setShowDevMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          const user = await auth.getUser();
          // Get user profile if needed
          if (user) {
            try {
              const profile = await api.getUserProfile(user.id);
              if (profile) {
                setUserName(`${profile.first_name} ${profile.last_name}`);
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserName("");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUserName("");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed w-full z-50 bg-white backdrop-blur-sm text-gray-900 border-b border-brand-lightsilver shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text flex items-center">
              Míche
              <img src="https://ik.imagekit.io/pg1g5ievp/Subtract.png?updatedAt=1747540715414" alt="" className="h-6 w-auto inline-block mx-0.5 align-middle" />
              Mobile
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm hover:text-brand-silver transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-sm hover:text-brand-silver transition-colors">
              Services
            </Link>
            <Link to="/professionals" className="text-sm hover:text-brand-silver transition-colors">
              Professionals
            </Link>
            <Link to="/how-it-works" className="text-sm hover:text-brand-silver transition-colors">
              How It Works
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-gray-900 hover:text-brand-silver flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-900 p-1 h-8 w-8 rounded-full"
                      onClick={() => setShowDevMenu(!showDevMenu)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    {showDevMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-brand-lightsilver">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-brand-lightsilver">
                          Developer Tools
                        </div>
                        <Link 
                          to="/dashboard/demo" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-lightsilver/20"
                          onClick={() => setShowDevMenu(false)}
                        >
                          Dashboard Demo
                        </Link>
                        <Link 
                          to="/auth-test" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-lightsilver/20"
                          onClick={() => setShowDevMenu(false)}
                        >
                          Auth Diagnostics
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="text-gray-900 border-brand-silver hover:bg-brand-lightsilver/20 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
              <Link to="/login">
                    <Button variant="ghost" className="text-gray-900 hover:text-brand-silver">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                    <Button className="bg-brand-silver hover:bg-brand-bronze text-black">
                  Sign Up
                </Button>
              </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4 animate-fade-in">
            <Link
              to="/"
              className="text-sm hover:text-brand-silver transition-colors px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-sm hover:text-brand-silver transition-colors px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/professionals"
              className="text-sm hover:text-brand-silver transition-colors px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Professionals
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm hover:text-brand-silver transition-colors px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-brand-lightsilver">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-gray-900 flex items-center justify-center">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className="border-t border-brand-lightsilver pt-2">
                    <p className="px-2 text-xs text-gray-500 mb-1">Developer Tools:</p>
                    <Link to="/dashboard/demo" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-700">
                        Dashboard Demo
                      </Button>
                    </Link>
                    <Link to="/auth-test" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-700">
                        Auth Diagnostics
                      </Button>
                    </Link>
              </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-gray-900 border-brand-silver hover:bg-brand-lightsilver/20 flex items-center justify-center"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-gray-900">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-brand-silver hover:bg-brand-bronze text-black">
                  Sign Up
                </Button>
              </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
