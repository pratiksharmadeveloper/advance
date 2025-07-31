'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings,
  Phone,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/constants'
import axiosInstance from '@/components/axiosInstance'
import { toast } from 'react-toastify'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface OTPForm {
  email: string
  otp: string
}

export default function LoginPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  // Sync token from localStorage and update on login
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      router.push('/patient/dashboard')
    }
  }, [token, router])

  const [loginData, setLoginData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [otpData, setOTPData] = useState<OTPForm>({
    email: '',
    otp: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  // OTP timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9+\-\s()]+$/
    return emailRegex.test(email) || phoneRegex.test(email)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (loginMethod === 'password') {
      setLoginData(prev => ({ ...prev, [field]: value }))
    } else {
      setOTPData(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (loginMethod === 'password') {
      if (!loginData.email.trim()) {
        newErrors.email = 'Email or phone number is required'
      } else if (!validateEmail(loginData.email)) {
        newErrors.email = 'Please enter a valid email or phone number'
      }
      
      if (!loginData.password.trim()) {
        newErrors.password = 'Password is required'
      }
    } else {
      if (!otpData.email.trim()) {
        newErrors.email = 'Email or phone number is required'
      } else if (!validateEmail(otpData.email)) {
        newErrors.email = 'Please enter a valid email or phone number'
      }
      
      if (otpSent && !otpData.otp.trim()) {
        newErrors.otp = 'OTP is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateLoginForm()) return
    
    setIsLoading(true)
    setSuccessMessage('')
    
    try {
      const response = await axiosInstance.post('/users/login', loginData)
      console.log('API Response:', response.data) // Debug API response
      if (response.data.status) {
        // Handle nested data structure
        const token = response.data.token || response.data.data?.token
        const user = response.data.user || response.data.data?.user
        if (token && user) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          console.log('Stored Token:', localStorage.getItem('token'))
          console.log('Stored User:', localStorage.getItem('user'))
          setToken(token) // Update token state
          toast.success('Login successful!')
          if (user.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/patient/dashboard')
          }
        } else {
          throw new Error('Token or user data missing in response')
        }
      } else {
        console.log('Login failed:', response.data.message)
        toast.error(response.data.message || 'Invalid credentials. Please try again.')
      }
    } catch (loginError) {
      // console.error('Login error:', loginError.response?.data || loginError.message)
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!otpData.email.trim() || !validateEmail(otpData.email)) {
      setErrors({ email: 'Please enter a valid email or phone number' })
      return
    }
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOtpSent(true)
      setOtpTimer(60)
      setSuccessMessage(`OTP sent to ${otpData.email}`)
      setErrors({})
    } catch (otpError) {
      console.error('OTP error:', otpError)
      setErrors({ general: 'Failed to send OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateLoginForm()) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (otpData.otp.length === 6) {
        localStorage.setItem('token', 'mock-otp-token') // Mock token
        localStorage.setItem('user', JSON.stringify({ id: 'otp-user-id', email: otpData.email, role: 'patient' }))
        setToken('mock-otp-token')
        router.push('/patient/dashboard')
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' })
      }
    } catch (verificationError) {
      console.error('OTP verification error:', verificationError)
      setErrors({ general: 'OTP verification failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem('token', 'mock-google-token') // Mock token
      localStorage.setItem('user', JSON.stringify({ id: 'google-user-id', email: 'user@gmail.com', role: 'patient' }))
      setToken('mock-google-token')
      router.push('/patient/dashboard')
    }, 2000)
  }

  const handleMethodChange = (method: 'password' | 'otp') => {
    setLoginMethod(method)
    setErrors({})
    setSuccessMessage('')
    setOtpSent(false)
    setOtpTimer(0)
  }

  const features = [
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Book, reschedule, and manage your appointments'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Access reports, prescriptions, and test results'
    },
    {
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'View invoices and make secure payments'
    },
    {
      icon: Settings,
      title: 'Profile Settings',
      description: 'Update your information and preferences'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Access Your Patient Portal</h1>
            <p className="text-gray-600 mb-6">
              Manage your appointments, view medical reports, and stay in control of your health journey.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <Link
                href="/register"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 whitespace-nowrap text-center"
              >
                Create New Account
              </Link>
              <div className="flex items-center text-gray-600">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span>Your data is secure and encrypted</span>
              </div>
            </div>
            
            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Demo Credentials</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@hospital.com / admin123</p>
                <p><strong>Patient:</strong> Any email / Any password</p>
                <p><strong>OTP:</strong> Use any 6-digit number</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form Section */}
      <div className="w-full bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Sign in to your patient portal</p>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">{successMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{errors.general}</span>
                </div>
              )}

              {/* Login Method Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => handleMethodChange('password')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === 'password'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Password Login
                </button>
                <button
                  onClick={() => handleMethodChange('otp')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === 'otp'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  OTP Login
                </button>
              </div>

              {/* Password Login Form */}
              {loginMethod === 'password' && (
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Enter your email or phone"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Log In'
                    )}
                  </button>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              )}

              {/* OTP Login Form */}
              {loginMethod === 'otp' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="otpEmail">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      id="otpEmail"
                      placeholder="Enter your email or phone"
                      value={otpData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={otpSent}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={isLoading || !otpData.email.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending OTP...
                        </div>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  ) : (
                    <form onSubmit={handleOTPLogin}>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="otp">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          id="otp"
                          placeholder="Enter 6-digit OTP"
                          value={otpData.otp}
                          onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.otp ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxLength={6}
                          required
                        />
                        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">
                            {otpTimer > 0 ? (
                              `Resend OTP in ${otpTimer}s`
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOTP}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Resend OTP
                              </button>
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false)
                              setOtpTimer(0)
                              setOTPData({ email: '', otp: '' })
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Change Email
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || otpData.otp.length !== 6}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                          </div>
                        ) : (
                          'Verify & Login'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Alternative Login Methods */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#EA4335" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Health, Simplified</h2>
            <p className="text-gray-600 mb-6">Everything you need to manage your healthcare in one place</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              
              return (
                <div key={index} className="flex flex-col items-center p-6 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-blue-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-12 max-w-2xl mx-auto p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Security & Privacy</h4>
            </div>
            <p className="text-sm text-green-700 text-center">
              Your personal health information is protected with bank-level encryption and follows strict privacy regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you with any questions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/contact"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <HelpCircle className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">FAQ</h3>
              <p className="text-sm text-gray-600">Find answers to common questions</p>
            </Link>
            
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Phone className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Call Support</h3>
              <p className="text-sm text-gray-600">{CONTACT_INFO.phone}</p>
            </a>
            
            <Link
              href="/contact"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <MessageSquare className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600">Chat with our support team</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}