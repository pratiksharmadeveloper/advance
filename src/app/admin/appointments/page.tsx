// src/app/admin/appointments/page.tsx
"use client"

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export default function AppointmentManagement() {
  const [filters, setFilters] = useState({
    dateRange: '',
    doctor: '',
    department: '',
    status: '',
    payment: ''
  })

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      date: "June 10, 2025",
      time: "10:30 AM",
      patient: {
        name: "Sita Sharma",
        id: "P001"
      },
      doctor: {
        name: "Dr. Anil Karki",
        department: "Cardiology"
      },
      department: "Cardiology",
      status: "Confirmed",
      statusVariant: "success" as const,
      payment: "Paid",
      paymentVariant: "info" as const
    },
    {
      id: 2,
      date: "June 10, 2025",
      time: "2:00 PM",
      patient: {
        name: "Ram Bahadur",
        id: "P002"
      },
      doctor: {
        name: "Dr. Priya Sharma",
        department: "Neurology"
      },
      department: "Neurology",
      status: "Pending",
      statusVariant: "warning" as const,
      payment: "Unpaid",
      paymentVariant: "danger" as const
    }
  ]

  const todayStats = [
    {
      title: "Total",
      value: "24",
      color: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "text-blue-400",
      icon: "calendar-check"
    },
    {
      title: "Confirmed",
      value: "18",
      color: "bg-green-50",
      textColor: "text-green-600",
      iconColor: "text-green-400",
      icon: "check-circle"
    },
    {
      title: "Pending",
      value: "4",
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-400",
      icon: "hourglass-half"
    },
    {
      title: "Cancelled",
      value: "2",
      color: "bg-red-50",
      textColor: "text-red-600",
      iconColor: "text-red-400",
      icon: "times-circle"
    }
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getIcon = (iconName: string, className: string) => {
    const icons = {
      'calendar-check': (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      'check-circle': (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      'hourglass-half': (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      'times-circle': (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[iconName as keyof typeof icons] || icons['calendar-check']
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
          <Badge variant="info" size="sm">
            Admin Panel
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Appointment
          </Button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card variant="default" padding="md">
        <CardContent>
          {/* Filters Section */}
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-4 mb-2">
              <div className="font-medium text-gray-700">Date Range</div>
              <div className="font-medium text-gray-700">Doctor</div>
              <div className="font-medium text-gray-700">Department</div>
              <div className="font-medium text-gray-700">Status</div>
              <div className="font-medium text-gray-700">Payment</div>
            </div>
            <div className="grid grid-cols-5 gap-4 items-end">
              {/* Date Input */}
              <div className="flex items-center">
                <Input
                  type="date"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Doctor Select */}
              <div className="relative">
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.doctor}
                  onChange={(e) => handleFilterChange('doctor', e.target.value)}
                >
                  <option value="">Doctors</option>
                  <option value="dr-anil-karki">Dr. Anil Karki</option>
                  <option value="dr-priya-sharma">Dr. Priya Sharma</option>
                </select>
                <svg className="fas fa-user-md absolute right-6 top-3 text-gray-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12a3 3 0 100-6 3 3 0 000 6zm0 2c-1.657 0-3 .895-3 2 0 .552.448 1 1 1h4c.552 0 1-.448 1-1 0-1.105-1.343-2-3-2z"/>
                </svg>
              </div>

              {/* Department Select */}
              <div className="relative">
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">Departments</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                </select>
                <svg className="fas fa-building absolute right-6 top-3 text-gray-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Status Select */}
              <div className="relative">
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <svg className="fas fa-info-circle absolute right-6 top-3 text-gray-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Payment Select with Filter Button */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.payment}
                    onChange={(e) => handleFilterChange('payment', e.target.value)}
                  >
                    <option value="">Payment</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <svg className="fas fa-money-bill-wave absolute right-6 top-3 text-gray-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                  </svg>
                </div>
                <Button variant="primary" size="md" className="h-[42px]">
                  <svg className="fas fa-filter h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Today&rsquo;s Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {todayStats.map((stat, index) => (
                <div key={index} className={`${stat.color} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                      <p className="text-gray-600">{stat.title}</p>
                    </div>
                    {getIcon(stat.icon, `h-8 w-8 ${stat.iconColor}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div>
            <h2 className="text-lg font-semibold mb-4">All Appointments</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{appointment.date}</div>
                        <div className="text-gray-500">{appointment.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{appointment.patient.name}</div>
                        <div className="text-gray-500">ID: {appointment.patient.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{appointment.doctor.name}</div>
                        <div className="text-gray-500">{appointment.doctor.department}</div>
                      </TableCell>
                      <TableCell className="text-gray-500">{appointment.department}</TableCell>
                      <TableCell>
                        <Badge variant={appointment.statusVariant}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={appointment.paymentVariant}>{appointment.payment}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-900">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing 1 to 2 of 24 results
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}