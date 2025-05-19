import React from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Mock service data
const mockServices = [
  {
    id: '1',
    name: 'Full Face Makeup',
    description: 'Complete makeup application including foundation, contouring, and eyes',
    price: 120,
    duration: 60,
    bookings: 18
  },
  {
    id: '2',
    name: 'Eyelash Extensions - Full Set',
    description: 'Application of synthetic lashes to enhance your natural lashes',
    price: 180,
    duration: 120,
    bookings: 24
  },
  {
    id: '3',
    name: 'Bridal Makeup',
    description: 'Premium makeup service for your special day with additional touch-up',
    price: 250,
    duration: 90,
    bookings: 12
  },
  {
    id: '4',
    name: 'Spray Tan',
    description: 'Full body airbrush tanning for a natural sun-kissed glow',
    price: 80,
    duration: 30,
    bookings: 8
  },
  {
    id: '5',
    name: 'Hair Styling',
    description: 'Professional styling for any occasion including blow dry and curling/straightening',
    price: 95,
    duration: 45,
    bookings: 16
  }
];

const ServicesView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service to offer to your clients.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input id="service-name" placeholder="e.g. Full Face Makeup" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea 
                  id="service-description" 
                  placeholder="Describe what's included in this service..." 
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-price">Price ($)</Label>
                  <Input id="service-price" type="number" min="0" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-duration">Duration (minutes)</Label>
                  <Input id="service-duration" type="number" min="0" step="5" placeholder="60" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 p-4">
          <CardTitle className="text-lg">Your Services</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead className="hidden md:table-cell">Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="max-w-md truncate">{service.description}</div>
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell className="hidden sm:table-cell">{service.duration} mins</TableCell>
                  <TableCell className="hidden md:table-cell">{service.bookings}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
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

export default ServicesView; 