'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { ALL_DOCTORS } from '@/lib/constants'

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const doctorsPerPage = 6 // Show 6 doctors per page

  // Get unique departments
  const departments = ['all', ...new Set(ALL_DOCTORS.map(doc => doc.department).filter(Boolean))]

  // Filter and search logic
  const filteredDoctors = ALL_DOCTORS.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || doctor.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  // Sort logic
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage)
  const startIndex = (currentPage - 1) * doctorsPerPage
  const endIndex = startIndex + doctorsPerPage
  const currentDoctors = sortedDoctors.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  // Pagination component
  const Pagination = () => {
    const getPageNumbers = () => {
      const pageNumbers = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pageNumbers.push(i)
          }
          pageNumbers.push('...')
          pageNumbers.push(totalPages)
        } else if (currentPage >= totalPages - 2) {
          pageNumbers.push(1)
          pageNumbers.push('...')
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pageNumbers.push(i)
          }
        } else {
          pageNumbers.push(1)
          pageNumbers.push('...')
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pageNumbers.push(i)
          }
          pageNumbers.push('...')
          pageNumbers.push(totalPages)
        }
      }

      return pageNumbers
    }

    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => typeof pageNumber === 'number' && setCurrentPage(pageNumber)}
            disabled={pageNumber === '...'}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pageNumber === currentPage
                ? 'bg-blue-600 text-white'
                : pageNumber === '...'
                ? 'text-gray-400 cursor-default'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb and Page Header with Background Image */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=600&q=80"
            alt="Hospital background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center text-sm text-white">
              <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
              <span className="text-blue-200">Find a Doctor</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                Find a Doctor
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Search by specialty, department, or name to book the right doctor for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or keyword..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            
            {/* Department Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            
            {/* Sort By */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedDoctors.length)} of {sortedDoctors.length} doctor{sortedDoctors.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedDepartment !== 'all' && ` in ${selectedDepartment}`}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doctor) => (
            <div key={doctor.id} className="card p-6 hover:shadow-xl transition-all duration-300">
              {/* Doctor Image and Basic Info */}
              <div className="flex items-center mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.qualification}</p>
                </div>
              </div>
              
              {/* Specialty and Department */}
              <div className="mb-4">
                <p className="text-blue-600 font-bold text-lg mb-1">{doctor.specialty}</p>
                <p className="text-sm text-gray-600 mb-1">{doctor.department}</p>
                <p className="text-sm text-gray-600 mb-2">{doctor.experience}</p>
                {doctor.branch && (
                  <p className="text-sm text-gray-500">📍 {doctor.branch}</p>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href="/appointment"
                  className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedDoctors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination />
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Not sure which doctor is right for you?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let our medical experts help you find the perfect doctor for your needs
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn-primary">
              Get Help Finding a Doctor
            </button>
            
            <Link
              href="tel:+977-1-XXXXXXX"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-md px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              📞 Call Us: +977-1-XXXXXXX
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}