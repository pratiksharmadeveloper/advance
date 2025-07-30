'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
}

export default function PatientDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. A. Karki',
      specialty: 'Cardiology Department',
      date: 'June 10, 2024',
      time: '10:30 AM',
      location: 'Room 203, Building A',
      status: 'confirmed'
    },
    {
      id: '2',
      doctor: 'Dr. M. Shrestha',
      specialty: 'Orthopedics Department',
      date: 'June 15, 2024',
      time: '2:00 PM',
      location: 'Room 105, Building B',
      status: 'pending'
    },
    {
      id: '3',
      doctor: 'Dr. S. Bista',
      specialty: 'General Medicine',
      date: 'May 28, 2024',
      time: '2:00 PM',
      location: 'Room 301, Building A',
      status: 'completed'
    },
    {
      id: '4',
      doctor: 'Dr. R. Thapa',
      specialty: 'Dermatology Department',
      date: 'May 20, 2024',
      time: '11:00 AM',
      location: 'Room 205, Building C',
      status: 'cancelled'
    }
  ])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }
    
    // Extract name from email for display or use default
    // get the user name from local storage
    const user = localStorage.getItem('user_name')
    if (user) {
      setUserName(user)
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_name')
    router.push('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation'
      case 'cancelled':
        return 'Canceled'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getIconClass = (specialty: string) => {
    if (specialty.includes('Cardiology')) return 'fas fa-heartbeat text-blue-600'
    if (specialty.includes('Orthopedics')) return 'fas fa-bone text-purple-600'
    if (specialty.includes('General Medicine')) return 'fas fa-stethoscope text-green-600'
    if (specialty.includes('Dermatology')) return 'fas fa-allergies text-red-600'
    return 'fas fa-user-md text-blue-600'
  }

  const nextAppointment = appointments.find(apt => apt.status === 'confirmed' || apt.status === 'pending')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo with heart symbol */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-red-500 text-2xl"></i>
            <span className="text-xl font-bold text-gray-800">HealthPortal</span>
          </div>
          
          {/* Right side - notification and profile */}
          <div className="flex items-center space-x-4">
            {/* Notification icon */}
            <div className="relative">
              <i className="fas fa-bell text-gray-600 text-xl hover:text-blue-600 cursor-pointer"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            
            {/* User profile dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-blue-500 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User profile" className="h-full w-full object-cover" />
                </div>
                <span className="text-gray-700 font-medium">{userName}</span>
                <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <i className="fas fa-user-edit mr-2"></i> Edit Profile
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <i className="fas fa-cog mr-2"></i> Settings
                </a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section with Border */}
        <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {userName}!</h1>
              <p className="text-gray-600">Manage your appointments efficiently.</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <i className="fas fa-user-edit mr-2"></i> Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6"></div>

        {/* Next Appointment Section */}
        {nextAppointment && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Next Appointment</h2>
            <div className="bg-white rounded-lg shadow p-6 flex justify-between">
              <div className="flex-1">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <i className="fas fa-user-md text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{nextAppointment.doctor}</h3>
                    <p className="text-gray-600 text-sm">{nextAppointment.specialty}</p>
                    <p className="text-gray-800 mt-1">{nextAppointment.date} • {nextAppointment.time}</p>
                    <p className="text-gray-600 text-sm">{nextAppointment.location}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(nextAppointment.status)}`}>
                      {getStatusText(nextAppointment.status)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button className="flex items-center justify-end text-blue-600 hover:text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i> View Details
                </button>
                <button className="flex items-center justify-end text-yellow-600 hover:text-yellow-800">
                  <i className="fas fa-calendar-alt mr-2"></i> Reschedule
                </button>
                <button className="flex items-center justify-end text-red-600 hover:text-red-800">
                  <i className="fas fa-times mr-2"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Appointments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Appointments</h2>
          
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow p-6 mb-4 flex justify-between">
              <div className="flex-1">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <i className={getIconClass(appointment.specialty) + " text-xl"}></i>
                  </div>
                  <div>
                    <h3 className="font-bold">{appointment.doctor}</h3>
                    <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                    <p className="text-gray-800 mt-1">{appointment.date} • {appointment.time}</p>
                    <p className="text-gray-600 text-sm">{appointment.location}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button className="flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm">
                  <i className="fas fa-info-circle mr-1"></i> View Details
                </button>
                {appointment.status === 'completed' ? (
                  <button className="flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm">
                    <i className="fas fa-calendar-plus mr-1"></i> Book Follow-up
                  </button>
                ) : appointment.status === 'cancelled' ? (
                  <button className="flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm">
                    <i className="fas fa-calendar-check mr-1"></i> Book Again
                  </button>
                ) : (
                  <>
                    <button className="flex items-center justify-end text-yellow-600 hover:text-yellow-800 text-sm">
                      <i className="fas fa-calendar-alt mr-1"></i> Reschedule
                    </button>
                    <button className="flex items-center justify-end text-red-600 hover:text-red-800 text-sm">
                      <i className="fas fa-times mr-1"></i> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination and Count */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600 text-sm">Showing {appointments.length} of 12 appointments</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100">3</button>
            <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}