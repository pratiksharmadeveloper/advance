'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Shield, Upload, MapPin, Star, Zap } from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '@/components/axiosInstance'

type BookingStep = 'datetime' | 'patient-info' | 'payment'

interface PatientInfo {
  fullName: string
  phone: string
  email: string
  age: string
  gender: string
  reason: string
  file?: File
}

interface TimeSlot {
  time: string
  period: 'morning' | 'afternoon' | 'evening'
  status: 'available' | 'limited' | 'booked'
  originalText: string
}

const timeSlots: TimeSlot[] = [
  // Morning slots
  { time: '9:00 AM', period: 'morning', status: 'available', originalText: '9:00 AM Available' },
  { time: '9:30 AM', period: 'morning', status: 'available', originalText: '9:30 AM Available' },
  { time: '10:00 AM', period: 'morning', status: 'available', originalText: '10:00 AM Available' },
  { time: '10:30 AM', period: 'morning', status: 'booked', originalText: '10:30 AM Booked' },
  { time: '11:00 AM', period: 'morning', status: 'limited', originalText: '11:00 AM Limited' },
  { time: '11:30 AM', period: 'morning', status: 'available', originalText: '11:30 AM Available' },
  
  // Afternoon slots
  { time: '1:00 PM', period: 'afternoon', status: 'available', originalText: '1:00 PM Available' },
  { time: '1:30 PM', period: 'afternoon', status: 'booked', originalText: '1:30 PM Booked' },
  { time: '2:00 PM', period: 'afternoon', status: 'available', originalText: '2:00 PM Available' },
  { time: '2:30 PM', period: 'afternoon', status: 'booked', originalText: '2:30 PM Booked' },
  
  // Evening slots
  { time: '4:00 PM', period: 'evening', status: 'limited', originalText: '4:00 PM Limited' },
  { time: '4:30 PM', period: 'evening', status: 'available', originalText: '4:30 PM Available' },
  { time: '5:00 PM', period: 'evening', status: 'booked', originalText: '5:00 PM Booked' },
]

export default function AppointmentPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime')
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM')
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    reason: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [doctorId, setDoctorId] = useState('550e8400-e29b-41d4-a716-446655440000') // Example valid UUID

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date('2025-07-31T00:50:00+05:45')) // Updated to current time
  const [selectedDate, setSelectedDate] = useState(new Date('2025-07-31T00:50:00+05:45'))

  // Progress steps configuration
  const steps = [
    { id: 'datetime', label: 'Date & Time', number: 1 },
    { id: 'patient-info', label: 'Patient Info', number: 2 },
    { id: 'payment', label: 'Payment', number: 3 }
  ]

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!(token && user))
  }, [])

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay, year, month }
  }

  const isToday = (date: Date) => {
    const today = new Date('2025-07-31T00:50:00+05:45')
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const isPast = (date: Date) => {
    const today = new Date('2025-07-31T00:50:00+05:45')
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const selectDate = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (!isPast(newDate)) {
      setSelectedDate(newDate)
    }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate)
    const days = []

    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push(
        <button
          key={`prev-${i}`}
          className="p-3 text-gray-400 cursor-not-allowed"
          disabled
          aria-label={`${prevDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} (previous month, unavailable)`}
        >
          {prevDate.getDate()}
        </button>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isCurrentDay = isToday(date)
      const isSelectedDay = isSelected(date)
      const isPastDay = isPast(date)

      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          disabled={isPastDay}
          aria-label={`${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}${isPastDay ? ' (unavailable)' : isSelectedDay ? ' (selected)' : ''}`}
          className={`p-3 transition-colors ${
            isPastDay
              ? 'text-gray-400 cursor-not-allowed'
              : isSelectedDay
              ? 'bg-blue-600 text-white rounded-full'
              : isCurrentDay
              ? 'font-bold text-blue-600 hover:bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const getTimeSlotStyle = (slot: TimeSlot) => {
    const baseClasses = "w-full py-2 px-3 rounded text-sm transition-colors"
    const now = new Date('2025-07-31T00:50:00+05:45')
    const [slotHour, slotPeriod] = slot.time.split(' ')
    const slotTime = new Date(selectedDate)
    const hour = parseInt(slotHour.split(':')[0])
    slotTime.setHours(slotPeriod === 'PM' && hour !== 12 ? hour + 12 : hour, parseInt(slotHour.split(':')[1]), 0, 0)

    if (slot.status === 'booked' || (isToday(selectedDate) && slotTime < now)) {
      return `${baseClasses} bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed`
    }
    
    if (selectedTimeSlot === slot.time) {
      return `${baseClasses} bg-blue-600 text-white`
    }
    
    switch (slot.status) {
      case 'available':
        return `${baseClasses} bg-green-50 hover:bg-green-100 border border-green-200 text-green-800`
      case 'limited':
        return `${baseClasses} bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800`
      default:
        return `${baseClasses} bg-green-50 hover:bg-green-100 border border-green-200 text-green-800`
    }
  }

  const getTimeSlotText = (slot: TimeSlot) => {
    if (selectedTimeSlot === slot.time) {
      return `${slot.time} Selected`
    }
    return slot.originalText
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    const now = new Date('2025-07-31T00:50:00+05:45')
    const [slotHour, slotPeriod] = slot.time.split(' ')
    const slotTime = new Date(selectedDate)
    const hour = parseInt(slotHour.split(':')[0])
    slotTime.setHours(slotPeriod === 'PM' && hour !== 12 ? hour + 12 : hour, parseInt(slotHour.split(':')[1]), 0, 0)

    if (slot.status !== 'booked' && !(isToday(selectedDate) && slotTime < now)) {
      setSelectedTimeSlot(slot.time)
      setSelectedTimePeriod(slot.period)
    }
  }

  const handlePatientInfoChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }))
  }

  const validatePatientInfo = () => {
    return patientInfo.fullName.trim() !== '' && patientInfo.phone.trim() !== ''
  }

  const getSafeUserData = () => {
    if (typeof window === 'undefined') return null
    try {
      const userJson = localStorage.getItem('user')
      return userJson ? JSON.parse(userJson) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  const createAppointment = async () => {
    if (!doctorId) {
      toast.error('Doctor information is missing')
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const user = getSafeUserData()
      // console.log('User data:', user)
      if (!user?.id) {
        throw new Error('User information is missing. Please log in.')
      }

      const appointmentDate = new Date(selectedDate)
      const [time, period] = selectedTimeSlot.split(' ')
      const hours = period === 'PM' && time.split(':')[0] !== '12' ? parseInt(time.split(':')[0]) + 12 : parseInt(time.split(':')[0])
      appointmentDate.setHours(hours, parseInt(time.split(':')[1]), 0, 0)

      const payload = {
        appointmentDate: appointmentDate.toISOString(),
        type: 'consultation',
        symptoms: patientInfo.reason || 'Headache and fever',
        doctorId,
        patientId: user.id,
        notes: patientInfo.reason || 'Patient has been experiencing symptoms for 3 days',
        fee: 150.00
      }

      const response = await axiosInstance.post('/appointments', payload)
      if (response.data.status) {
        toast.success('Appointment booked successfully!')
        window.location.href = '/'
      } else {
        throw new Error(response.data.message || 'Failed to book appointment')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to book appointment. Please try again.')
      setErrors({ general: 'Failed to book appointment. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const ProgressBar = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              currentStep === step.id
                ? 'bg-blue-600 text-white'
                : steps.findIndex(s => s.id === currentStep) > index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.number}
            </div>
            <span className={`mt-2 text-sm font-medium ${
              currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/doctors" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Find Doctor
          </Link>
          
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Secure Payment</span>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200"></div>

      {/* Progress Steps */}
      <ProgressBar />

      <div className="w-full border-t border-gray-200"></div>

      {/* Doctor Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <Image
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
              alt="Dr. Sushil Shrestha"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dr. Sushil Shrestha, MD</h1>
            <p className="text-blue-600 font-medium">Cardiology</p>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Satabbato Branch</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center text-yellow-600 mr-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1">4.8</span>
                </div>
                <span className="text-sm text-gray-500">(124 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200"></div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}

        {/* Date & Time Selection */}
        {currentStep === 'datetime' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Time</h2>
            
            {/* Date Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Choose Date</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-lg font-medium text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 text-sm">
                      <th className="py-2">Sun</th>
                      <th className="py-2">Mon</th>
                      <th className="py-2">Tue</th>
                      <th className="py-2">Wed</th>
                      <th className="py-2">Thu</th>
                      <th className="py-2">Fri</th>
                      <th className="py-2">Sat</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {Array.from({ length: Math.ceil(renderCalendar().length / 7) }, (_, weekIndex) => (
                      <tr key={weekIndex}>
                        {renderCalendar().slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                          <td key={dayIndex}>{day}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Available Time Slots</h3>
              
              {/* Time Period Filter */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSelectedTimePeriod('morning')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTimePeriod === 'morning'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Morning
                </button>
                <button
                  onClick={() => setSelectedTimePeriod('afternoon')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTimePeriod === 'afternoon'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Afternoon
                </button>
                <button
                  onClick={() => setSelectedTimePeriod('evening')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTimePeriod === 'evening'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Evening
                </button>
              </div>
              
              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-2">
                {timeSlots
                  .filter(slot => slot.period === selectedTimePeriod)
                  .map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSlotSelect(slot)}
                      disabled={slot.status === 'booked' || (isToday(selectedDate) && new Date(selectedDate).setHours(
                        parseInt(slot.time.split(':')[0]) + (slot.time.includes('PM') && slot.time.split(':')[0] !== '12' ? 12 : 0),
                        parseInt(slot.time.split(':')[1].split(' ')[0]),
                        0,
                        0
                      ) < new Date('2025-07-31T00:50:00+05:45'))}
                      aria-label={`${slot.time} appointment slot, ${slot.status}${selectedTimeSlot === slot.time ? ', currently selected' : ''}`}
                      className={getTimeSlotStyle(slot)}
                    >
                      {getTimeSlotText(slot)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Emergency Booking */}
            <div className="border-t border-gray-200 pt-6">
              <button 
                className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                aria-label="Book emergency appointment - next available slot will be assigned"
              >
                <Zap className="h-5 w-5 mr-2" />
                Book ASAP (Emergency/Walk-in)
                <span className="ml-2 text-sm text-gray-500">Next available slot will be assigned</span>
              </button>
            </div>
          </div>
        )}

        {/* Patient Information */}
        {currentStep === 'patient-info' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Details</h1>
            
            <form className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full-name"
                  placeholder="Enter patient name"
                  value={patientInfo.fullName}
                  onChange={(e) => handlePatientInfoChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  value={patientInfo.phone}
                  onChange={(e) => handlePatientInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={patientInfo.email}
                  onChange={(e) => handlePatientInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              {/* Age and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    id="age"
                    min="1"
                    max="120"
                    placeholder="Enter age"
                    value={patientInfo.age}
                    onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    value={patientInfo.gender}
                    onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              {/* Reason for Visit */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  placeholder="Describe your symptoms or reason for consultation"
                  value={patientInfo.reason}
                  onChange={(e) => handlePatientInfoChange('reason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Report (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-600 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Click to upload</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          aria-describedby="file-upload-description"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p id="file-upload-description" className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Payment Section */}
        {currentStep === 'payment' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Options</h1>
            
            {/* Payment Methods */}
            <div className="space-y-4 mb-8">
              <button className="w-full border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-600 transition-colors text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Pay Online</h3>
                    <p className="text-sm text-gray-500">eSewa, Khalti, FonePay, Visa, Mastercard</p>
                  </div>
                  <span className="font-medium">¥150</span>
                </div>
              </button>
              
              <button className="w-full border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-600 transition-colors text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Pay at Hospital</h3>
                    <p className="text-sm text-gray-500">Pay during your visit</p>
                  </div>
                  <span className="font-medium">¥150</span>
                </div>
              </button>
              
              <button className="w-full border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-600 transition-colors text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Insurance</h3>
                    <p className="text-sm text-gray-500">Use your insurance coverage</p>
                  </div>
                  <span className="font-medium text-green-600">Covered</span>
                </div>
              </button>
            </div>
            
            {/* Promo Code */}
            <div className="mb-6">
              <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">Enter promo code</label>
              <div className="flex">
                <input
                  type="text"
                  id="promo-code"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors">
                  Apply
                </button>
              </div>
            </div>
            
            {/* Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium">¥150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">¥25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-¥25</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">¥150</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {currentStep !== 'datetime' && (
            <button
              onClick={() => {
                if (currentStep === 'patient-info') setCurrentStep('datetime')
                if (currentStep === 'payment') setCurrentStep('patient-info')
              }}
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            onClick={() => {
              if (currentStep === 'datetime') {
                if (!isLoggedIn) {
                  window.location.href = '/login?redirect=/appointment'
                  return
                }
                setCurrentStep('patient-info')
              } else if (currentStep === 'patient-info' && validatePatientInfo()) {
                setCurrentStep('payment')
              } else if (currentStep === 'payment') {
                createAppointment()
              }
            }}
            disabled={(currentStep === 'patient-info' && !validatePatientInfo()) || isLoading}
            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading && currentStep === 'payment' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </div>
            ) : (
              <>
                {currentStep === 'datetime' && (isLoggedIn ? 'Continue to Patient Info' : 'Log In to Continue')}
                {currentStep === 'patient-info' && 'Continue to Payment'}
                {currentStep === 'payment' && 'Confirm Booking'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Help */}
      <div className="bg-gray-50 py-4 border-t border-gray-200 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">
              Call Support
            </a>{' '}
            <span className="mx-2">•</span>{' '}
            <a href="https://wa.me/1234567890" className="text-blue-600 hover:underline">
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}