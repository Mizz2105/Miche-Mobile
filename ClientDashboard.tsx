import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth, api, type Booking } from "@/lib/supabase";

// Mock data for development and preview
const MOCK_DATA = {
  userName: "Jessica Smith",
  totalSpent: 845.75,
  bookings: [
    {
      id: "b1",
      booking_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      service: { name: "Full Face Makeup Application" },
      professional: { profile: { first_name: "Michelle", last_name: "Johnson" } },
      location: "Client's Home, Brooklyn",
      status: "confirmed",
      total_amount: 125.00
    },
    {
      id: "b2",
      booking_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      service: { name: "Eyelash Extensions - Full Set" },
      professional: { profile: { first_name: "Sarah", last_name: "Williams" } },
      location: "Client's Office, Manhattan",
      status: "completed",
      total_amount: 220.50
    },
    {
      id: "b3",
      booking_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      service: { name: "Hair Styling - Special Occasion" },
      professional: { profile: { first_name: "Alex", last_name: "Chen" } },
      location: "Client's Home, Manhattan",
      status: "completed",
      total_amount: 180.25
    },
    {
      id: "b4",
      booking_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      service: { name: "Manicure & Pedicure" },
      professional: { profile: { first_name: "Olivia", last_name: "Garcia" } },
      location: "Client's Home, Queens",
      status: "confirmed",
      total_amount: 95.00
    },
    {
      id: "b5",
      booking_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      service: { name: "Bridal Makeup Trial" },
      professional: { profile: { first_name: "Michelle", last_name: "Johnson" } },
      location: "Client's Home, Brooklyn",
      status: "completed",
      total_amount: 225.00
    }
  ]
};

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [userName, setUserName] = useState("");
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if we should use mock data
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
          console.log("Using demo mode with mock data");
          setUseMockData(true);
          setUserName(MOCK_DATA.userName);
          setBookings(MOCK_DATA.bookings);
          setTotalSpent(MOCK_DATA.totalSpent);
          setLoading(false);
          return;
        }
        
        const user = await auth.getUser();
        
        if (!user) {
          // Use mock data if no user is found
          console.log("No user found, using mock data");
          setUseMockData(true);
          setUserName(MOCK_DATA.userName);
          setBookings(MOCK_DATA.bookings);
          setTotalSpent(MOCK_DATA.totalSpent);
          setLoading(false);
          return;
        }
        
        // Get user profile
        try {
          const profile = await api.getUserProfile(user.id);
          if (profile) {
            setUserName(`${profile.first_name} ${profile.last_name}`);
          } else {
            // Use mock data if no profile found
            console.log("No profile found, using mock data");
            setUseMockData(true);
            setUserName(MOCK_DATA.userName);
            setBookings(MOCK_DATA.bookings);
            setTotalSpent(MOCK_DATA.totalSpent);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Use mock data on error
          setUseMockData(true);
          setUserName(MOCK_DATA.userName);
          setBookings(MOCK_DATA.bookings);
          setTotalSpent(MOCK_DATA.totalSpent);
          setLoading(false);
          return;
        }
        
        // Get bookings
        try {
          const userBookings = await api.getClientBookings(user.id);
          if (userBookings && userBookings.length > 0) {
            setBookings(userBookings);
            
            // Calculate total spent
            const total = userBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
            setTotalSpent(total);
          } else {
            // Use mock data if no bookings found
            console.log("No bookings found, using mock data");
            setUseMockData(true);
            setBookings(MOCK_DATA.bookings);
            setTotalSpent(MOCK_DATA.totalSpent);
          }
        } catch (error) {
          console.error("Error fetching client bookings:", error);
          // Use mock data on error
          setUseMockData(true);
          setBookings(MOCK_DATA.bookings);
          setTotalSpent(MOCK_DATA.totalSpent);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use mock data on error
        setUseMockData(true);
        setUserName(MOCK_DATA.userName);
        setBookings(MOCK_DATA.bookings);
        setTotalSpent(MOCK_DATA.totalSpent);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      case "completed":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Client Dashboard</h1>
            {!loading && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600 mb-2 sm:mb-0">Welcome back, {userName}</p>
                {useMockData && (
                  <div className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full self-start sm:self-auto">
                    Using Demo Data
                  </div>
                )}
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-10 w-10 text-brand-bronze" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dashboard summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="bg-brand-bronze/10 pb-2">
                    <CardTitle className="text-lg font-medium">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold">${totalSpent.toFixed(2)}</div>
                    <p className="text-sm text-gray-500 mt-1">Across all bookings</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-brand-bronze/10 pb-2">
                    <CardTitle className="text-lg font-medium">Completed Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {bookings.filter(booking => booking.status === "completed").length}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Services received</p>
                  </CardContent>
                </Card>
                
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardHeader className="bg-brand-bronze/10 pb-2">
                    <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {bookings.filter(booking => booking.status === "confirmed").length}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Scheduled services</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Bookings */}
              <Card>
                <CardHeader className="bg-brand-bronze/10 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between pb-2">
                  <CardTitle className="text-lg font-medium mb-2 sm:mb-0">Recent Bookings</CardTitle>
                  <Button asChild variant="outline" size="sm" className="ml-auto sm:ml-0">
                    <Link to="/services">Book New Service</Link>
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 overflow-auto">
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="hidden md:table-cell">Service</TableHead>
                            <TableHead className="hidden sm:table-cell">Professional</TableHead>
                            <TableHead className="hidden lg:table-cell">Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map(booking => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                {format(new Date(booking.booking_date), "MMM d, yyyy")}
                                <div className="text-xs text-gray-500">
                                  {format(new Date(booking.booking_date), "h:mm a")}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {booking.service.name}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {booking.professional.profile.first_name} {booking.professional.profile.last_name}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {booking.location}
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${parseFloat(booking.total_amount).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                      <Button asChild>
                        <Link to="/services">Book Your First Service</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Mobile Booking Details Section */}
              <div className="sm:hidden space-y-4">
                <h3 className="font-medium text-lg">Booking Details</h3>
                {bookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{booking.service.name}</CardTitle>
                          <p className="text-sm text-gray-500">
                            with {booking.professional.profile.first_name} {booking.professional.profile.last_name}
                          </p>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3 border-t border-gray-100">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Date & Time</span>
                          <span className="text-sm">
                            {format(new Date(booking.booking_date), "MMM d, yyyy")} at {format(new Date(booking.booking_date), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Location</span>
                          <span className="text-sm">{booking.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount</span>
                          <span className="text-sm font-medium">${parseFloat(booking.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientDashboard; 