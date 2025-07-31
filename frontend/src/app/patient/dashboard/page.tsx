'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/components/axiosInstance'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Appointment {
  id: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  type: string
  appointmentDate: string
  symptoms: string
  diagnosis: string | null
  prescription: string | null
  notes: string
  fee: number
  uploadedReport: string | null
  paymentStatus: string | null
  promocode: string | null
  doctor: string
  createdAt: string
  updatedAt: string
  user: User
}

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState<string | null>(null)
  const [newDateTime, setNewDateTime] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    const userString = localStorage.getItem('user')
    try {
      if (userString && userString !== 'undefined') {
        setUser(JSON.parse(userString))
      }
    } catch (err) {
      console.error('Invalid JSON in localStorage for "user":', err)
      setUser(null)
    }

    const fetchAppointments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get('/appointments/my-appointments', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.status === 200) {
          setAppointments(response.data.data || [])
        } else {
          setError('Failed to fetch appointments')
        }
      } catch (error) {
        setError('Error fetching appointments. Please try again later.')
        console.error('Error fetching appointments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('token')
      await axiosInstance.patch(`/appointments/${appointmentId}/cancelled`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ))
      setShowCancelDialog(null)
      setNotification({ type: 'success', message: 'Appointment cancelled successfully' })
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      setNotification({ type: 'error', message: 'Failed to cancel appointment' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRescheduleAppointment = async (appointmentId: string) => {
    if (!newDateTime) {
      setNotification({ type: 'error', message: 'Please select a date and time' })
      return
    }

    setIsProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axiosInstance.patch(`/appointments/reschedule/${appointmentId}`, 
        { newDate: new Date(newDateTime).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, appointmentDate: response.data.appointmentDate } : apt
      ))
      setShowRescheduleDialog(null)
      setNewDateTime('')
      setNotification({ type: 'success', message: 'Appointment rescheduled successfully' })
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      setNotification({ type: 'error', message: 'Failed to reschedule appointment' })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation'
      case 'cancelled': return 'Canceled'
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getIconClass = (type: string) => {
    if (type.includes('consultation')) return 'fas fa-user-md text-blue-600'
    return 'fas fa-user-md text-blue-600'
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const nextAppointment = appointments.find(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
          <button 
            className="ml-2 text-sm" 
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCancelDialog(null)}
                disabled={isProcessing}
              >
                No
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleCancelAppointment(showCancelDialog)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Dialog */}
      {showRescheduleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select New Date and Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowRescheduleDialog(null)
                  setNewDateTime('')
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleRescheduleAppointment(showRescheduleDialog)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-red-500 text-2xl"></i>
            <span className="text-xl font-bold text-gray-800">HealthPortal</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <i className="fas fa-bell text-gray-600 text-xl hover:text-blue-600 cursor-pointer"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {appointments.filter(apt => apt.status === 'pending').length}
              </span>
            </div>
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-blue-500 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User profile" className="h-full w-full object-cover" />
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
              </div>
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
        <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.firstName}!
              </h1>
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

        {nextAppointment && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Next Appointment</h2>
            <div className="bg-white rounded-lg shadow p-6 flex justify-between">
              <div className="flex-1">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <i className={getIconClass(nextAppointment.type) + " text-xl"}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Dr. {nextAppointment.doctor}</h3>
                    <p className="text-gray-600 text-sm">{nextAppointment.type}</p>
                    <p className="text-gray-800 mt-1">
                      {formatDateTime(nextAppointment.appointmentDate).date} • 
                      {formatDateTime(nextAppointment.appointmentDate).time}
                    </p>
                    <p className="text-gray-600 text-sm">{nextAppointment.symptoms}</p>
                    {nextAppointment.notes && (
                      <p className="text-gray-600 text-sm mt-1">Notes: {nextAppointment.notes}</p>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(nextAppointment.status)}`}>
                      {getStatusText(nextAppointment.status)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button className="flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm">
                  <i className="fas fa-info-circle mr-1"></i> View Details
                </button>
                <button 
                  className="flex items-center justify-end text-yellow-600 hover:text-yellow-800 text-sm"
                  onClick={() => setShowRescheduleDialog(nextAppointment.id)}
                >
                  <i className="fas fa-calendar-alt mr-1"></i> Reschedule
                </button>
                <button 
                  className="flex items-center justify-end text-red-600 hover:text-red-800 text-sm"
                  onClick={() => setShowCancelDialog(nextAppointment.id)}
                >
                  <i className="fas fa-times mr-1"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Appointments</h2>
          
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No appointments found.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow p-6 mb-4 flex justify-between">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className={getIconClass(appointment.type) + " text-xl"}></i>
                    </div>
                    <div>
                      <h3 className="font-bold">Dr. {appointment.doctor}</h3>
                      <p className="text-gray-600 text-sm">{appointment.type}</p>
                      <p className="text-gray-800 mt-1">
                        {formatDateTime(appointment.appointmentDate).date} • 
                        {formatDateTime(appointment.appointmentDate).time}
                      </p>
                      <p className="text-gray-600 text-sm">Symptoms: {appointment.symptoms}</p>
                      {appointment.notes && (
                        <p className="text-gray-600 text-sm mt-1">Notes: {appointment.notes}</p>
                      )}
                      {appointment.diagnosis && (
                        <p className="text-gray-600 text-sm mt-1">Diagnosis: {appointment.diagnosis}</p>
                      )}
                      {appointment.prescription && (
                        <p className="text-gray-600 text-sm mt-1">Prescription: {appointment.prescription}</p>
                      )}
                      <p className="text-gray-600 text-sm mt-1">Fee: Rs. {appointment.fee}</p>
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
                      <button 
                        className="flex items-center justify-end text-yellow-600 hover:text-yellow-800 text-sm"
                        onClick={() => setShowRescheduleDialog(appointment.id)}
                      >
                        <i className="fas fa-calendar-alt mr-1"></i> Reschedule
                      </button>
                      <button 
                        className="flex items-center justify-end text-red-600 hover:text-red-800 text-sm"
                        onClick={() => setShowCancelDialog(appointment.id)}
                      >
                        <i className="fas fa-times mr-1"></i> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {appointments.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600 text-sm">Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}