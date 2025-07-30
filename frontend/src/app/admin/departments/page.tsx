// src/app/admin/departments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import axiosInstance from '@/components/axiosInstance'

interface Department {
  id: string
  name: string
  description: string
  imageUrl?: string
  status: 'active' | 'inactive'
  doctorCount: number
  createdAt: string
}

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])

  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get('/departments')
      if (response.data.status) {
        setDepartments(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDepartment = (id: string) => {
    setSelectedDepartments(prev => 
      prev.includes(id) 
        ? prev.filter(deptId => deptId !== id)
        : [...prev, id]
    )
  }

  const toggleAllDepartments = () => {
    setSelectedDepartments(prev => 
      prev.length === departments.length ? [] : departments.map(dept => dept.id)
    )
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === '' || dept.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
          <Badge variant="info">Admin Panel</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/departments/add">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Department
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent>
          {/* Search Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">Search Departments</h2>
            
            <div className="relative flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="my-4 border-gray-200" />
          
          {/* Department List Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">Showing {filteredDepartments.length} departments</p>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="selectAll" 
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={selectedDepartments.length === departments.length}
                  onChange={toggleAllDepartments}
                />
                <label htmlFor="selectAll" className="text-sm text-gray-600">Select All</label>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import
              </Button>
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export
              </Button>
            </div>
          </div>
          
          {/* Department List */}
          <div className="space-y-3">
            {/* Column Headers - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 bg-gray-100 rounded-lg font-medium text-gray-700">
              <div className="col-span-1"></div>
              <div className="col-span-3">Department</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Doctors</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            {/* Department Items */}
            {filteredDepartments.map((department) => (
              <div key={department.id} className="bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3 px-4">
                  <div className="col-span-1">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedDepartments.includes(department.id)}
                      onChange={() => toggleDepartment(department.id)}
                    />
                  </div>
                  <div className="col-span-3 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${department.imageUrl || '/images/hospital-image.jpg'})` }}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{department.name}</h3>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{department.description}</p>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">{department.doctorCount} doctors</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={department.status === 'active' ? 'success' : 'danger'}>
                      {department.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">{new Date(department.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-1">
                    <div className="flex space-x-2">
                      <Link href={`/admin/departments/edit/${department.id}`}>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4">
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-500 focus:ring-blue-500 mt-1"
                      checked={selectedDepartments.includes(department.id)}
                      onChange={() => toggleDepartment(department.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${department.imageUrl || '/images/hospital-image.jpg'})` }}></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{department.name}</h3>
                          <p className="text-sm text-gray-600">{department.doctorCount} doctors</p>
                        </div>
                        <Badge variant={department.status === 'active' ? 'success' : 'danger'}>
                          {department.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{department.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Created: {new Date(department.createdAt).toLocaleDateString()}</span>
                        <div className="flex space-x-2">
                          <Link href={`/admin/departments/edit/${department.id}`}>
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <Link href="/admin/departments/add">
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Department
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 