// src/app/admin/departments/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
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
    status: 'active'
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    // Fetch department data from API
    const fetchDepartment = async () => {
      setIsLoadingData(true)
      try {
        const response = await axiosInstance.get(`/departments/${departmentId}`)
        if (response.data.status) {
          const foundDepartment = response.data.data
          setDepartment(foundDepartment)
          setFormData({
            name: foundDepartment.name,
            description: foundDepartment.description,
            status: foundDepartment.status
          })
          if (foundDepartment.imageUrl) {
            setImagePreview(foundDepartment.imageUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching department:', error)
      } finally {
        setIsLoadingData(false)
      }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('status', formData.status)
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      const response = await axiosInstance.put(`/departments/${departmentId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.status) {
        router.push('/admin/departments')
      } else {
        console.error('Failed to update department:', response.data.message)
      }
    } catch (error: any) {
      console.error('Error updating department:', error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await axiosInstance.delete(`/departments/${departmentId}`)
      
      if (response.data.status) {
        router.push('/admin/departments')
      } else {
        console.error('Failed to delete department:', response.data.message)
      }
    } catch (error: any) {
      console.error('Error deleting department:', error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
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
            <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${department.imageUrl || '/images/hospital-image.jpg'})` }}></div>
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

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Department Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a new image for the department (JPG, PNG, GIF up to 5MB)</p>
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
            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="w-48 h-32 rounded-lg bg-cover bg-center border border-gray-200" 
                     style={{ backgroundImage: `url(${imagePreview})` }}>
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