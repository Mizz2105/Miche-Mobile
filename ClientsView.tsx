import React from 'react';
import { Search, UserPlus, UserCog, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock client data
const mockClients = [
  { 
    id: '1', 
    name: 'Jessica Smith', 
    email: 'jessica.smith@example.com', 
    phone: '(555) 123-4567',
    totalBookings: 5,
    lastBooking: '2023-05-15',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Michael Brown', 
    email: 'michael.brown@example.com', 
    phone: '(555) 987-6543',
    totalBookings: 3,
    lastBooking: '2023-06-02', 
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Emma Thompson', 
    email: 'emma.thompson@example.com', 
    phone: '(555) 456-7890',
    totalBookings: 8,
    lastBooking: '2023-06-10', 
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Daniel Johnson', 
    email: 'daniel.johnson@example.com', 
    phone: '(555) 234-5678',
    totalBookings: 2,
    lastBooking: '2023-04-28', 
    status: 'inactive'
  },
  { 
    id: '5', 
    name: 'Sophia Garcia', 
    email: 'sophia.garcia@example.com', 
    phone: '(555) 876-5432',
    totalBookings: 6,
    lastBooking: '2023-06-15', 
    status: 'active'
  },
];

const ClientsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Client List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search clients..." 
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Total Bookings</TableHead>
                <TableHead className="hidden lg:table-cell">Last Booking</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{client.totalBookings}</TableCell>
                  <TableCell className="hidden lg:table-cell">{client.lastBooking}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsView; 