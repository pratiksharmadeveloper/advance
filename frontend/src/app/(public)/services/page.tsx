'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, 
  ChevronRight, 
  Heart,
  Brain,
  Shield,
  Stethoscope,
  Baby,
  Camera,
  ChevronDown
} from 'lucide-react'
import { DEPARTMENTS } from '@/lib/constants'

interface FAQ {
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    question: "Do I need a referral to see a specialist?",
    answer: "No, you can book directly with our specialists without a referral. However, some insurance plans may require one."
  },
  {
    question: "Can I book tests online?",
    answer: "Yes, diagnostic tests and imaging services can be scheduled online through our patient portal or by calling our department directly."
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Please bring a valid ID, insurance card, list of current medications, and any relevant medical records or previous test results."
  }
]


export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Get all unique departments for filter
  const allDepartments = ['all', ...DEPARTMENTS.map(dept => dept.name)]

  // Filter services based on search and department
  const filteredServices = DEPARTMENTS.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || service.name === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'cardiology':
        return Heart
      case 'neurology':
        return Brain
      case 'emergency':
        return Shield
      case 'pediatrics':
        return Baby
      case 'radiology':
        return Camera
      default:
        return Stethoscope
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-blue-600">Services</span>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80"
          alt="Hospital Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive healthcare services with state-of-the-art facilities and expert medical professionals
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {allDepartments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full pl-10 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Search services..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Departments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Medical Departments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {searchTerm || selectedDepartment !== 'all' 
                ? `Showing ${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''}`
                : 'Comprehensive healthcare services across multiple specialties with state-of-the-art facilities and expert medical professionals.'
              }
            </p>
          </div>

          {/* Departments Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((department, index) => {
              const IconComponent = getServiceIcon(department.name)
              
              return (
                <div 
                  key={department.id} 
                  className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {department.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {department.description}
                  </p>
                  <div className="flex space-x-4">
                    <Link
                      href={`/services/${department.id}`}
                      className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/appointment"
                      className="flex-1 text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>


          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDepartment('all')
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Specialized Care CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Specialized Care?</h2>
            <p className="text-xl md:text-2xl mb-8">
              Consult with our experts today and get the best medical care tailored to your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/appointment"
                className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 font-medium transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our services
            </p>
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        openFAQ === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          
        </div>
      </section>

    </div>
  )
}