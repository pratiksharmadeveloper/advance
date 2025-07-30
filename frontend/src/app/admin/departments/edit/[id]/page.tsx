// src/app/admin/departments/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

interface Department {
  id: string
  name: string
  description: string
  image: string
  status: 'active' | 'inactive'
  doctorCount: number
  createdAt: string
}

export default function EditDepartmentPage() {
  const router = useRouter()
  const params = useParams()
  const departmentId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [department, setDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  })

  // Mock data - in real app, this would come from API
  const mockDepartments: Department[] = [
    {
      id: '1',
      name: 'Cardiology',
      description: 'Advanced heart care and treatment',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
      status: 'active',
      doctorCount: 8,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Neurology',
      description: 'Brain and nervous system care',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
      status: 'active',
      doctorCount: 6,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Orthopedics',
      description: 'Bone, joint, and muscle care',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
      status: 'active',
      doctorCount: 5,
      createdAt: '2024-02-01'
    }
  ]

  useEffect(() => {
    // Simulate API call to fetch department data
    const fetchDepartment = async () => {
      setIsLoadingData(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundDepartment = mockDepartments.find(dept => dept.id === departmentId)
      if (foundDepartment) {
        setDepartment(foundDepartment)
        setFormData({
          name: foundDepartment.name,
          description: foundDepartment.description,
          image: foundDepartment.image,
          status: foundDepartment.status
        })
      }
      setIsLoadingData(false)
    }

    fetchDepartment()
  }, [departmentId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically make an API call to update the department
    console.log('Updating department:', { id: departmentId, ...formData })
    
    setIsLoading(false)
    router.push('/admin/departments')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically make an API call to delete the department
    console.log('Deleting department:', departmentId)
    
    setIsLoading(false)
    router.push('/admin/departments')
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading department...</p>
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Department not found</h3>
        <p className="text-gray-600 mb-4">The department you're looking for doesn't exist or has been removed.</p>
        <Link href="/admin/departments">
          <Button>Back to Departments</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/departments">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Departments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Department</h1>
            <p className="text-gray-600">Update department information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="info">Admin Panel</Badge>
          <Badge variant={department.status === 'active' ? 'success' : 'danger'}>
            {department.status}
          </Badge>
        </div>
      </div>

      {/* Department Info Card */}
      <Card variant="outlined">
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${department.image})` }}></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
              <p className="text-gray-600">{department.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{department.doctorCount} doctors</span>
                <span>Created: {new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Edit Department Information</h2>
          <p className="text-sm text-gray-600">Update the department details below</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Cardiology, Neurology"
                value={formData.name}
                onChange={handleInputChange}
                required
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the department's services and specialties..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Department Image URL
              </label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/department-image.jpg"
                value={formData.image}
                onChange={handleInputChange}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <p className="text-xs text-gray-500 mt-1">Provide a URL for the department's representative image</p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="w-48 h-32 rounded-lg bg-cover bg-center border border-gray-200" 
                     style={{ backgroundImage: `url(${formData.image})` }}>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button 
                variant="danger" 
                type="button" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Department
              </Button>
              
              <div className="flex items-center space-x-4">
                <Link href="/admin/departments">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" isLoading={isLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update Department
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 