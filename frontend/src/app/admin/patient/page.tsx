"use client"

import { useState } from 'react'
import { Calendar, MapPin, Phone, Mail, User, Bell, Settings, LogOut, Plus, FileText, Heart, Activity, Pill } from 'lucide-react'

export default function EnhancedPatientDashboard() {
  const [showProfile, setShowProfile] = useState(false)

  // Mock patient data
  const patient = {
    name: "Sita Sharma",
    id: "AIH-00123",
    age: 34,
    gender: "Female",
    phone: "+977 980XXXXXXX",
    email: "sita.sharma@email.com",
    address: "Lalitpur, Nepal",
    bloodType: "O+",
    emergencyContact: "+977 981XXXXXXX"
  }

  const upcomingAppointments = [
    {
      id: 1,
      date: "2025-07-20",
      time: "10:30 AM",
      doctor: "Dr. Anil Karki",
      department: "Cardiology",
      type: "Follow-up",
      location: "Room 203, Building A",
      status: "confirmed",
      notes: "Bring previous test reports"
    },
    {
      id: 2,
      date: "2025-07-25",
      time: "2:00 PM",
      doctor: "Dr. Priya Sharma",
      department: "Neurology",
      type: "Consultation",
      location: "Room 105, Building B",
      status: "pending",
      notes: "Fasting required"
    }
  ]

  const recentAppointments = [
    {
      id: 3,
      date: "2025-07-10",
      time: "10:30 AM",
      doctor: "Dr. Anil Karki",
      department: "Cardiology",
      type: "Check-up",
      status: "completed",
      prescription: "Available",
      labResults: "Normal"
    },
    {
      id: 4,
      date: "2025-07-05",
      time: "3:00 PM",
      doctor: "Dr. Suresh Bista",
      department: "General Medicine",
      type: "Consultation",
      status: "completed",
      prescription: "Available",
      labResults: "Pending"
    }
  ]

  const healthMetrics = [
    { label: "Blood Pressure", value: "120/80", status: "normal", icon: Heart },
    { label: "Heart Rate", value: "72 bpm", status: "normal", icon: Activity },
    { label: "Weight", value: "65 kg", status: "normal", icon: User },
    { label: "BMI", value: "22.5", status: "normal", icon: Activity }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-600'
      case 'warning': return 'bg-yellow-100 text-yellow-600'
      case 'critical': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-xl font-bold text-gray-900">HealthPortal</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">SS</span>
                  </div>
                  <span className="font-medium text-gray-700">{patient.name}</span>
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Edit Profile</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Settings</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {patient.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your health and appointments in one place.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Appointment</p>
                <p className="text-lg font-bold text-gray-900">July 20</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lab Reports</p>
                <p className="text-lg font-bold text-gray-900">3 New</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                <p className="text-lg font-bold text-gray-900">2 Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-lg font-bold text-gray-900">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Book New</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-sm text-gray-600">{appointment.time}</div>
                            </div>
                            <div className="h-12 w-px bg-gray-300"></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                              <p className="text-sm text-gray-600">{appointment.department} • {appointment.type}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Reschedule</button>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-xs text-gray-500">{appointment.time}</div>
                          </div>
                          <div className="h-8 w-px bg-gray-300"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                            <p className="text-sm text-gray-600">{appointment.department} • {appointment.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {appointment.prescription === 'Available' && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                              <Pill className="h-4 w-4" />
                              <span>Prescription</span>
                            </button>
                          )}
                          {appointment.labResults && (
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>Lab Results</span>
                            </button>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Health Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusIcon(metric.status)}`}>
                        <metric.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                        <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      metric.status === 'normal' ? 'bg-green-400' :
                      metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patient ID</span>
                  <span className="text-sm font-medium text-gray-900">{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age</span>
                  <span className="text-sm font-medium text-gray-900">{patient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blood Type</span>
                  <span className="text-sm font-medium text-gray-900">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender</span>
                  <span className="text-sm font-medium text-gray-900">{patient.gender}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Book Appointment</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">View Lab Reports</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Pill className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">My Prescriptions</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Contact Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}