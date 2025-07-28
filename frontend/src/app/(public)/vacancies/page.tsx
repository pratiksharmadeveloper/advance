'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Clock, 
  Building, 
  Eye, 
  Send, 
  Users, 
  TrendingUp, 
  Heart,
  ArrowRight
} from 'lucide-react'

interface JobListing {
  id: string
  title: string
  department: string
  location: string
  deadline: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string[]
}

const JOB_LISTINGS: JobListing[] = [
  {
    id: '1',
    title: 'Staff Nurse – Emergency Ward',
    department: 'Nursing Department',
    location: 'Satabbato Branch',
    deadline: 'June 20, 2025',
    type: 'full-time',
    description: 'We are seeking a dedicated and experienced Staff Nurse to join our Emergency Ward team. The ideal candidate will provide high-quality patient care in a fast-paced environment.',
    requirements: [
      'Bachelor of Nursing (BSN) or equivalent',
      'Valid nursing license',
      'Minimum 2 years of emergency care experience',
      'BLS and ACLS certification required',
      'Strong communication and teamwork skills'
    ]
  },
  {
    id: '2',
    title: 'Medical Officer',
    department: 'Medical Department',
    location: 'Main Branch',
    deadline: 'July 15, 2025',
    type: 'full-time',
    description: 'Join our medical team as a Medical Officer providing comprehensive patient care and supporting various medical departments.',
    requirements: [
      'MBBS degree with valid medical license',
      'Minimum 3 years of clinical experience',
      'Strong diagnostic and treatment skills',
      'Excellent interpersonal communication',
      'Ability to work in shifts'
    ]
  },
  {
    id: '3',
    title: 'Administrative Assistant',
    department: 'Administration',
    location: 'Satabbato Branch',
    deadline: 'June 30, 2025',
    type: 'part-time',
    description: 'Support our administrative operations with data entry, scheduling, and patient coordination tasks.',
    requirements: [
      'Bachelor\'s degree preferred',
      'Proficiency in MS Office applications',
      'Excellent organizational skills',
      'Previous healthcare administration experience preferred',
      'Strong attention to detail'
    ]
  },
  {
    id: '4',
    title: 'Laboratory Technician',
    department: 'Laboratory',
    location: 'Main Branch',
    deadline: 'August 10, 2025',
    type: 'full-time',
    description: 'Perform laboratory tests and analyses to support patient diagnosis and treatment plans.',
    requirements: [
      'Diploma in Medical Laboratory Technology',
      'Valid laboratory technician license',
      'Experience with laboratory equipment',
      'Knowledge of quality control procedures',
      'Ability to work with minimal supervision'
    ]
  },
  {
    id: '5',
    title: 'Pharmacist',
    department: 'Pharmacy',
    location: 'Both Branches',
    deadline: 'July 25, 2025',
    type: 'full-time',
    description: 'Dispense medications and provide pharmaceutical care to patients under physician supervision.',
    requirements: [
      'PharmD or equivalent pharmacy degree',
      'Valid pharmacy license',
      'Knowledge of drug interactions and contraindications',
      'Experience with pharmacy management systems',
      'Strong customer service skills'
    ]
  },
  {
    id: '6',
    title: 'Physiotherapist',
    department: 'Rehabilitation',
    location: 'Main Branch',
    deadline: 'September 5, 2025',
    type: 'contract',
    description: 'Provide physiotherapy services to patients recovering from injuries, surgeries, or managing chronic conditions.',
    requirements: [
      'Bachelor\'s or Master\'s in Physiotherapy',
      'Valid physiotherapy license',
      'Experience in musculoskeletal rehabilitation',
      'Knowledge of exercise therapy techniques',
      'Compassionate patient care approach'
    ]
  }
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  // Get unique values for filters
  const departments = ['all', ...new Set(JOB_LISTINGS.map(job => job.department))]
  const jobTypes = ['all', ...new Set(JOB_LISTINGS.map(job => job.type))]
  const locations = ['all', ...new Set(JOB_LISTINGS.map(job => job.location))]

  // Filter jobs based on search and filters
  const filteredJobs = JOB_LISTINGS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesType = selectedType === 'all' || job.type === selectedType
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation
    
    return matchesSearch && matchesDepartment && matchesType && matchesLocation
  })

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Full-time'
      case 'part-time': return 'Part-time'
      case 'contract': return 'Contract'
      default: return type
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800'
      case 'part-time': return 'bg-green-100 text-green-800'
      case 'contract': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80"
            alt="Hospital team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto relative z-10 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Join Our Team</h1>
            <p className="text-lg md:text-xl mb-8">
              Build a meaningful career in healthcare. Make a difference in people&apos;s lives while growing professionally in a supportive environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('job-listings')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 font-medium transition-colors"
              >
                View Open Positions
              </button>
              <button 
                onClick={() => document.getElementById('why-work-with-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 font-medium transition-colors"
              >
                Why Join Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Openings</h2>
            <p className="text-gray-600">Explore our available positions and find the perfect role that matches your skills and passion.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, department, or keywords..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : getTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="job-listings" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 pr-2">{job.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getTypeBadgeColor(job.type)}`}>
                    {getTypeLabel(job.type)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 text-gray-600">
                  <div className="flex items-center">
                    <Building className="mr-2 text-blue-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-blue-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-blue-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Deadline: {job.deadline}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                
                <div className="flex space-x-3">
                  <Link
                    href={`/careers/${job.id}`}
                    className="flex-1 text-center text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center py-2 px-3 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    href={`/careers/${job.id}/apply`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center py-2 px-3 rounded-md transition-colors text-sm"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later for new openings.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDepartment('all')
                  setSelectedType('all')
                  setSelectedLocation('all')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section id="why-work-with-us" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a team that values excellence, growth, and making a difference in people&apos;s lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Culture */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600 text-2xl h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team-Oriented Culture</h3>
              <p className="text-gray-600">
                Work alongside dedicated professionals in a collaborative environment that values every team member.
              </p>
            </div>

            {/* Learning & Growth */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-blue-600 text-2xl h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning & Growth</h3>
              <p className="text-gray-600">
                Continuous professional development opportunities and career advancement paths.
              </p>
            </div>

            {/* Our Facilities */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="text-blue-600 text-2xl h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">State-of-the-art Facilities</h3>
              <p className="text-gray-600">
                Work with the latest medical technology and equipment in modern, well-equipped facilities.
              </p>
            </div>
          </div>

          {/* Meet Our Team CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/about/team"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Meet Our Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}