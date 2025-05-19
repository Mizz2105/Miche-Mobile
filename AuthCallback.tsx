import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        
        // Process the hash if it exists
        if (hash) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            // Successfully signed in
            // Navigate to the dashboard page which will redirect to the appropriate
            // client or professional dashboard based on user type
            navigate("/dashboard");
          } else {
            throw new Error("No session found");
          }
        }
      } catch (err) {
        console.error("Error during auth callback:", err);
        setError("Authentication failed. Please try again.");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-brand-bronze text-white rounded-md"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Completing Sign In</h1>
            <p className="text-gray-700 mb-6">Please wait while we verify your credentials...</p>
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-brand-bronze" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 