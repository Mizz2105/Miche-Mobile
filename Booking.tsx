import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocation, useSearchParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { professionals } from "@/data/professionals";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedPro, setSelectedPro] = useState<string | undefined>(undefined);
  const [preSelectedProName, setPreSelectedProName] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Get professional ID from URL parameters
    const proId = searchParams.get('pro');
    const proName = searchParams.get('name');
    
    if (proId) {
      setSelectedPro(proId);
      setPreSelectedProName(proName ? decodeURIComponent(proName) : undefined);
    }
  }, [searchParams]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedService || !selectedPro) {
      alert("Please select all required fields");
      return;
    }

    // In a real app, this would send data to the backend
    alert(`Booking confirmed!\nService: ${selectedService}\nProfessional: ${preSelectedProName || selectedPro}\nDate: ${format(selectedDate, 'PPP')}\nTime: ${selectedTime}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6">Book Your Appointment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule your mobile beauty service with just a few clicks.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 shadow-md">
              <div className="space-y-6">
                <div>
                  <label className="block text-foreground font-medium mb-2">Select Service</label>
                  <Select onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spray-tanning">Spray Tanning</SelectItem>
                      <SelectItem value="waxing">Waxing</SelectItem>
                      <SelectItem value="brow-tint">Brow Tint</SelectItem>
                      <SelectItem value="eyelashes">Eyelashes</SelectItem>
                      <SelectItem value="makeup">Makeup</SelectItem>
                      <SelectItem value="tattoo">Tattoo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-foreground font-medium mb-2">Select Professional</label>
                  <Select value={selectedPro} onValueChange={setSelectedPro}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={preSelectedProName || "Choose a professional"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jessica-martinez">Jessica Martinez</SelectItem>
                      <SelectItem value="michael-chen">Michael Chen</SelectItem>
                      <SelectItem value="aisha-johnson">Aisha Johnson</SelectItem>
                      <SelectItem value="david-kim">David Kim</SelectItem>
                      <SelectItem value="sophia-rodriguez">Sophia Rodriguez</SelectItem>
                      <SelectItem value="james-wilson">James Wilson</SelectItem>
                      {professionals.map(pro => (
                        <SelectItem key={pro.id} value={pro.id}>
                          {pro.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {preSelectedProName && (
                    <p className="text-sm text-brand-bronze mt-1">
                      You selected {preSelectedProName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-foreground font-medium mb-2">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates and dates more than 3 months in the future
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const maxDate = new Date();
                          maxDate.setMonth(maxDate.getMonth() + 3);
                          return date < today || date > maxDate;
                        }}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-foreground font-medium mb-2">Select Time</label>
                  <Select onValueChange={setSelectedTime} disabled={!selectedDate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedDate ? "Choose a time" : "Select a date first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{time}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleBookAppointment}
                  className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white mt-4"
                  disabled={!selectedDate || !selectedTime || !selectedService || !selectedPro}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
