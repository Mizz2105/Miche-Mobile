import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "@/lib/supabase";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDemoButton, setShowDemoButton] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("ProtectedRoute: Checking authentication...");
        
        // Check if we should bypass auth for demo
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
          console.log("ProtectedRoute: Demo mode detected, bypassing auth check");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        const session = await auth.getSession();
        
        if (session) {
          console.log("ProtectedRoute: User is authenticated", session);
          setIsAuthenticated(true);
        } else {
          console.log("ProtectedRoute: No session found");
          // Try to get user for additional debugging
          try {
            const user = await auth.getUser();
            console.log("ProtectedRoute: User check result:", user);
            
            if (user) {
              console.log("ProtectedRoute: Found user but no session, possible token issue");
              setAuthError("Found user but no session. There may be an authentication token issue.");
              setShowDemoButton(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (userError) {
            console.error("ProtectedRoute: User check failed:", userError);
            setAuthError("Failed to verify user authentication status.");
            setShowDemoButton(true);
          }
        }
      } catch (error) {
        console.error("ProtectedRoute: Auth check failed:", error);
        setIsAuthenticated(false);
        setAuthError("Authentication check failed. Please try logging in again.");
        setShowDemoButton(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-bronze" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={() => navigate("/auth-test")}>
              Go to Auth Diagnostics
            </Button>
            
            {showDemoButton && (
              <Button variant="outline" onClick={() => navigate("/dashboard/demo")}>
                View Dashboard Demo
              </Button>
            )}
            
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 