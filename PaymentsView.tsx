import React from 'react';
import { Download, ArrowUpDown, Calendar, DollarSign, CreditCard, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';

// Mock payment data
const mockPayments = [
  {
    id: 'pay_1',
    date: new Date('2023-06-18T14:30:00'),
    client: 'Jessica Smith',
    service: 'Full Face Makeup',
    amount: 120,
    status: 'completed',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'pay_2',
    date: new Date('2023-06-15T10:00:00'),
    client: 'Michael Brown',
    service: 'Haircut & Styling',
    amount: 85,
    status: 'completed',
    paymentMethod: 'PayPal'
  },
  {
    id: 'pay_3',
    date: new Date('2023-06-10T16:45:00'),
    client: 'Emma Thompson',
    service: 'Eyelash Extensions',
    amount: 180,
    status: 'completed',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'pay_4',
    date: new Date('2023-06-08T11:15:00'),
    client: 'Sophia Garcia',
    service: 'Bridal Makeup',
    amount: 250,
    status: 'completed',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'pay_5',
    date: new Date('2023-06-05T13:30:00'),
    client: 'Daniel Johnson',
    service: 'Beard Trim',
    amount: 40,
    status: 'pending',
    paymentMethod: 'Cash'
  },
  {
    id: 'pay_6',
    date: new Date('2023-06-01T15:00:00'),
    client: 'Olivia Wilson',
    service: 'Spray Tan',
    amount: 80,
    status: 'completed',
    paymentMethod: 'Credit Card'
  }
];

// Calculate summary statistics
const totalRevenue = mockPayments.reduce((sum, payment) => 
  payment.status === 'completed' ? sum + payment.amount : sum, 0
);

const pendingRevenue = mockPayments.reduce((sum, payment) => 
  payment.status === 'pending' ? sum + payment.amount : sum, 0
);

const completedPayments = mockPayments.filter(p => p.status === 'completed').length;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PaymentsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">For all completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Awaiting payment confirmation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-gray-500">Total completed transactions</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Payment History</CardTitle>
            <div className="flex gap-2">
              <div className="w-[150px]">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select defaultValue="all-time">
                  <SelectTrigger>
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(payment.date, 'MMM d, yyyy')}
                    <div className="text-xs text-gray-500">{format(payment.date, 'h:mm a')}</div>
                  </TableCell>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell className="hidden md:table-cell">{payment.service}</TableCell>
                  <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{payment.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsView; 