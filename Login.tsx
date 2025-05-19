import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithGoogle();
      // Redirect happens automatically to Google OAuth
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const authData = await auth.signInWithEmail(email, password);
      
      if (!authData.user) {
        throw new Error('Failed to sign in');
      }
      
      // Redirect to dashboard page - the Dashboard component will handle
      // redirecting to the appropriate client/professional dashboard
      navigate("/dashboard");
      
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      console.error("Email sign-in error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-brand-bronze/20">
            <h1 className="text-2xl font-bold text-center gradient-text mb-8">Welcome Back</h1>
            
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white">
                <TabsTrigger value="client" className="bg-white text-black data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-black/70 data-[state=active]:text-black">Client</TabsTrigger>
                <TabsTrigger value="professional" className="bg-white text-black data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-brand-black/70 data-[state=active]:text-black">Professional</TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="mt-4">
                <div className="space-y-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Sign in with Google
                  </Button>
                  
                  <div className="relative flex items-center my-6">
                    <span className="flex-grow border-t border-gray-300"></span>
                    <span className="px-3 text-sm text-gray-500">or</span>
                    <span className="flex-grow border-t border-gray-300"></span>
                  </div>
                  
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-black">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-black hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                        id="password" 
                      type="password"
                      required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white"
                    />
                  </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                  </Button>
                </form>
                
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-brand-bronze hover:underline">
                    Sign up
                  </Link>
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="mt-4">
                <div className="space-y-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Sign in with Google
                  </Button>
                  
                  <div className="relative flex items-center my-6">
                    <span className="flex-grow border-t border-gray-300"></span>
                    <span className="px-3 text-sm text-gray-500">or</span>
                    <span className="flex-grow border-t border-gray-300"></span>
                  </div>
                  
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pro-email" className="text-black">Email</Label>
                    <Input
                      id="pro-email"
                      type="email"
                      required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pro-password" className="text-black">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-brand-bronze hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="pro-password"
                      type="password"
                      required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white"
                    />
                  </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                  </Button>
                </form>
                
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Not a professional yet?{" "}
                  <Link to="/join-as-pro" className="text-brand-bronze hover:underline">
                        Join as a Pro
                  </Link>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
