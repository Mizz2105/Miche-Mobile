import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { auth, api, supabase } from "@/lib/supabase";
import ProfessionalDashboardLayout from "@/components/ProfessionalDashboardLayout";
import CalendarView from "@/components/CalendarView";
import ClientsView from "@/components/ClientsView";
import ServicesView from "@/components/ServicesView";
import PaymentsView from "@/components/PaymentsView";

// Mock data for development and preview
const MOCK_DATA = {
  professionalName: "Michelle Johnson",
  totalRevenue: 4250.75,
  totalClients: 12,
  bookings: [
    // Upcoming bookings
    {
      id: "p1",
      booking_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      client: { id: "c1", first_name: "Jessica", last_name: "Smith" },
      service: { name: "Full Face Makeup Application" },
      location: "Client's Home, Brooklyn",
      status: "confirmed",
      total_amount: 125.00
    },
    {
      id: "p2",
      booking_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
      client: { id: "c2", first_name: "Emma", last_name: "Thompson" },
      service: { name: "Bridal Makeup" },
      location: "Hotel Suite, Manhattan",
      status: "pending",
      total_amount: 350.00
    },
    {
      id: "p3",
      booking_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      client: { id: "c3", first_name: "Sophia", last_name: "Garcia" },
      service: { name: "Hair Styling - Special Occasion" },
      location: "Client's Home, Manhattan",
      status: "confirmed",
      total_amount: 180.00
    },
    
    // Past bookings
    {
      id: "p4",
      booking_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      client: { id: "c4", first_name: "Olivia", last_name: "Wilson" },
      service: { name: "Eyelash Extensions - Fill" },
      location: "Client's Office, Manhattan",
      status: "completed",
      total_amount: 95.00
    },
    {
      id: "p5",
      booking_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      client: { id: "c5", first_name: "Madison", last_name: "Brown" },
      service: { name: "Bridal Hair and Makeup" },
      location: "Reception Venue, Brooklyn",
      status: "completed",
      total_amount: 425.00
    },
    {
      id: "p6",
      booking_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      client: { id: "c1", first_name: "Jessica", last_name: "Smith" },
      service: { name: "Makeup Application - Party" },
      location: "Client's Home, Queens",
      status: "completed",
      total_amount: 150.00
    },
    {
      id: "p7",
      booking_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      client: { id: "c6", first_name: "Ava", last_name: "Martinez" },
      service: { name: "Full Set Eyelash Extensions" },
      location: "Client's Home, Bronx",
      status: "cancelled",
      total_amount: 200.00
    }
  ]
};

// Format appointments for the calendar view
const formatAppointmentsForCalendar = (bookings) => {
  return bookings.map(booking => ({
    id: booking.id,
    date: new Date(booking.booking_date),
    duration: 60, // Assuming 60 minutes default duration
    client: {
      id: booking.client.id,
      name: `${booking.client.first_name} ${booking.client.last_name}`
    },
    service: {
      name: booking.service.name
    },
    location: booking.location,
    status: booking.status
  }));
};

const ProfessionalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [professionalName, setProfessionalName] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if we should use mock data
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
          console.log("Using demo mode with mock data");
          setUseMockData(true);
          setProfessionalName(MOCK_DATA.professionalName);
          setTotalClients(MOCK_DATA.totalClients);
          setTotalRevenue(MOCK_DATA.totalRevenue);
          setBookings(MOCK_DATA.bookings);
          setLoading(false);
          return;
        }
        
        const user = await auth.getUser();
        
        if (!user) {
          return;
        }
        
        // Get user profile
        const profile = await api.getUserProfile(user.id);
        if (profile) {
          setProfessionalName(`${profile.first_name} ${profile.last_name}`);
          
          // Get professional ID from profile
          const professionalId = await getProfessionalId(profile.id);
          
          if (professionalId) {
            // Get bookings
            const profBookings = await api.getProfessionalBookings(professionalId);
            setBookings(profBookings);
            
            // Calculate total revenue
            const total = profBookings
              .filter(booking => booking.status === "completed")
              .reduce((sum, booking) => sum + booking.total_amount, 0);
            setTotalRevenue(total);
            
            // Count unique clients
            const uniqueClientIds = new Set(
              profBookings.map(booking => booking.client.id)
            );
            setTotalClients(uniqueClientIds.size);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getProfessionalId = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id')
        .eq('profile_id', profileId)
        .single();
      
      if (error) throw error;
      return data?.id;
    } catch (error) {
      console.error("Error getting professional ID:", error);
      return null;
    }
  };

  // Redirect to the calendar view by default if the URL is just /dashboard/professional
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/dashboard/professional") {
      navigate("/dashboard/professional/calendar");
    }
  }, [navigate]);

  // Prepare appointments for calendar
  const appointments = formatAppointmentsForCalendar(bookings);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10 text-brand-bronze" />
      </div>
    );
  }

  return (
    <ProfessionalDashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/professional/calendar" replace />} />
        <Route path="/calendar" element={<CalendarView appointments={appointments} />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/services" element={<ServicesView />} />
        <Route path="/payments" element={<PaymentsView />} />
        <Route path="/settings" element={
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-4 text-gray-600">Account and profile settings will appear here.</p>
          </div>
        } />
      </Routes>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalDashboard; 