import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay, addHours, startOfDay, addMinutes } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// This defines what an appointment looks like
interface Appointment {
  id: string;
  date: Date;
  duration: number; // in minutes
  client: {
    id: string;
    name: string;
  };
  service: {
    name: string;
  };
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Map status to colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 border-green-500 text-green-800';
    case 'pending':
      return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 border-red-500 text-red-800';
    case 'completed':
      return 'bg-blue-100 border-blue-500 text-blue-800';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-800';
  }
};

interface CalendarViewProps {
  appointments: Appointment[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Get appointments for the selected date
  const getDayAppointments = (date: Date) => {
    return appointments.filter((appointment) => 
      isSameDay(new Date(appointment.date), date)
    );
  };
  
  // Get appointments for the selected week
  const getWeekAppointments = (date: Date) => {
    const weekStart = startOfWeek(date);
    const daysInWeek = [...Array(7)].map((_, i) => addDays(weekStart, i));
    
    return daysInWeek.map(day => ({
      date: day,
      appointments: getDayAppointments(day)
    }));
  };

  // Generate time slots for the day view (8am - 8pm, 30 min intervals)
  const getDayTimeSlots = () => {
    const slots = [];
    const dayStart = startOfDay(selectedDate);
    const startHour = 8; // 8am
    const endHour = 20; // 8pm
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = addMinutes(addHours(dayStart, hour), minute);
        slots.push(slotTime);
      }
    }
    
    return slots;
  };

  // Find appointments for a specific time slot
  const getAppointmentsForTimeSlot = (timeSlot: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const appointmentHour = appointmentDate.getHours();
      const appointmentMinute = appointmentDate.getMinutes();
      const slotHour = timeSlot.getHours();
      const slotMinute = timeSlot.getMinutes();
      
      return (
        isSameDay(appointmentDate, selectedDate) &&
        appointmentHour === slotHour &&
        appointmentMinute === slotMinute
      );
    });
  };

  // Calendar day render function - show dots for days with appointments
  const renderCalendarDay = (date: Date) => {
    const dayAppointments = getDayAppointments(date);
    const hasAppointments = dayAppointments.length > 0;
    
    return (
      <div className="relative">
        <div>{format(date, 'd')}</div>
        {hasAppointments && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayAppointments.length > 3 ? (
              <span className="h-1 w-1 rounded-full bg-brand-bronze"></span>
            ) : (
              dayAppointments.map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-brand-bronze"></span>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  // Render day view with time slots
  const renderDayView = () => {
    const timeSlots = getDayTimeSlots();
    
    return (
      <div className="mt-4 border rounded-lg overflow-hidden bg-white">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-lg">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
        </div>
        
        <div className="divide-y">
          {timeSlots.map((timeSlot, index) => {
            const slotAppointments = getAppointmentsForTimeSlot(timeSlot);
            const hasAppointments = slotAppointments.length > 0;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "flex p-2 hover:bg-gray-50",
                  hasAppointments ? "bg-gray-50" : ""
                )}
              >
                <div className="w-20 flex-shrink-0 text-gray-500 font-medium">
                  {format(timeSlot, 'h:mm a')}
                </div>
                
                <div className="flex-grow">
                  {hasAppointments ? (
                    <div className="space-y-2">
                      {slotAppointments.map(appointment => (
                        <div 
                          key={appointment.id}
                          className={cn(
                            "p-2 rounded border-l-4 shadow-sm",
                            getStatusColor(appointment.status)
                          )}
                        >
                          <div className="font-medium">{appointment.service.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <User size={14} />
                            <span>{appointment.client.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} />
                            <span>{appointment.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-8 flex items-center text-gray-400 text-sm">
                      Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDays = getWeekAppointments(selectedDate);
    const timeSlots = getDayTimeSlots();
    
    return (
      <div className="mt-4 border rounded-lg overflow-x-auto bg-white">
        <div className="grid grid-cols-8 min-w-[800px]">
          {/* Time column */}
          <div className="border-r">
            <div className="h-12 border-b"></div> {/* Empty cell for header */}
            {timeSlots.map((slot, index) => (
              <div key={index} className="h-16 border-b p-2 text-xs text-gray-500">
                {format(slot, 'h:mm a')}
              </div>
            ))}
          </div>
          
          {/* Days columns */}
          {weekDays.map(({ date, appointments }, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0">
              <div className="h-12 border-b p-2 text-center font-medium bg-gray-50">
                <div>{format(date, 'EEEE')}</div>
                <div className="text-sm text-gray-500">{format(date, 'MMM d')}</div>
              </div>
              
              {timeSlots.map((timeSlot, slotIndex) => {
                const slotAppointments = appointments.filter(apt => {
                  const aptTime = new Date(apt.date);
                  return aptTime.getHours() === timeSlot.getHours() && 
                         aptTime.getMinutes() === timeSlot.getMinutes();
                });
                
                return (
                  <div 
                    key={slotIndex} 
                    className={cn(
                      "h-16 border-b p-1",
                      slotAppointments.length > 0 ? "bg-gray-50" : "",
                      isSameDay(date, new Date()) ? "bg-blue-50/50" : ""
                    )}
                  >
                    {slotAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className={cn(
                          "text-xs p-1 rounded border-l-2 truncate mb-1",
                          getStatusColor(appointment.status)
                        )}
                        title={`${appointment.service.name} - ${appointment.client.name}`}
                      >
                        <div className="font-medium truncate">{appointment.service.name}</div>
                        <div className="truncate">{appointment.client.name}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <Card className="md:w-80 flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => setViewMode('day')}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    viewMode === 'day' 
                      ? "bg-brand-bronze/10 text-brand-bronze" 
                      : "hover:bg-gray-100"
                  )}
                >
                  Day
                </button>
                <button 
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    viewMode === 'week' 
                      ? "bg-brand-bronze/10 text-brand-bronze" 
                      : "hover:bg-gray-100"
                  )}
                >
                  Week
                </button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="border rounded-md"
            />
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Legend</h4>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-grow">
          {viewMode === 'day' ? renderDayView() : renderWeekView()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView; 