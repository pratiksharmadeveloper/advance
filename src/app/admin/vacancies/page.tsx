'use client'

import React, { useState } from 'react'

interface Vacancy {
  id: string
  title: string
  department: string
  openings: number
  postedDate: string
  deadline: string
  status: 'Active' | 'Closed' | 'Draft'
  applications: number
  type: string
}

export default function VacanciesManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [titleFilter, setTitleFilter] = useState('Title')
  const [departmentFilter, setDepartmentFilter] = useState('Department')

  const [vacancies] = useState<Vacancy[]>([
    {
      id: '1',
      title: 'Staff Nurse',
      department: 'Nursing',
      openings: 4,
      postedDate: 'June 1, 2025',
      deadline: 'June 15, 2025',
      status: 'Active',
      applications: 27,
      type: 'Full-time'
    },
    {
      id: '2',
      title: 'Medical Lab Technician',
      department: 'Laboratory',
      openings: 2,
      postedDate: 'May 28, 2025',
      deadline: 'June 12, 2025',
      status: 'Active',
      applications: 15,
      type: 'Full-time'
    },
    {
      id: '3',
      title: 'Emergency Room Doctor',
      department: 'Emergency',
      openings: 1,
      postedDate: 'May 20, 2025',
      deadline: 'June 5, 2025',
      status: 'Closed',
      applications: 42,
      type: 'Full-time'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Closed':
        return 'bg-red-100 text-red-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddVacancy = () => {
    // Navigate to add vacancy form
    console.log('Add new vacancy')
  }

  const handleView = (id: string) => {
    console.log('View vacancy:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit vacancy:', id)
  }

  const handleCancel = (id: string) => {
    console.log('Cancel vacancy:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete vacancy:', id)
  }

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTitle = titleFilter === 'Title' || vacancy.title === titleFilter
    const matchesDepartment = departmentFilter === 'Department' || vacancy.department === departmentFilter
    
    return matchesSearch && matchesTitle && matchesDepartment
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vacancies Management</h1>
          <p className="text-gray-600 mt-1">Manage job postings and applications</p>
        </div>
        <div className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
          HR Admin
        </div>
      </div>

      {/* Add New Vacancy Section with Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleAddVacancy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <i className="fas fa-plus mr-2"></i> Add New Vacancy
            </button>
            <div className="text-gray-600">
              <span className="font-medium">Total Jobs:</span> {vacancies.length}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Search..."
              />
            </div>
            
            <div className="flex space-x-3">
              <select 
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>Title</option>
                <option>Staff Nurse</option>
                <option>Medical Lab Technician</option>
                <option>Emergency Room Doctor</option>
              </select>
              
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>Department</option>
                <option>Nursing</option>
                <option>Laboratory</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Openings</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVacancies.map((vacancy) => (
                <React.Fragment key={vacancy.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{vacancy.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vacancy.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vacancy.openings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vacancy.postedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vacancy.deadline}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vacancy.status)}`}>
                        {vacancy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span className="text-green-600">{vacancy.applications} <i className="fas fa-check-circle"></i></span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(vacancy.id)}
                          className="text-blue-500 hover:text-blue-700 transition-colors" 
                          title="View"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleEdit(vacancy.id)}
                          className="text-green-500 hover:text-green-700 transition-colors" 
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleCancel(vacancy.id)}
                          className="text-yellow-500 hover:text-yellow-700 transition-colors" 
                          title="Cancel"
                        >
                          <i className="fas fa-ban"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(vacancy.id)}
                          className="text-red-500 hover:text-red-700 transition-colors" 
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-none">
                    <td className="px-6 py-1 whitespace-nowrap text-gray-500 text-sm" colSpan={8}>
                      {vacancy.type}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVacancies.length}</span> of <span className="font-medium">{vacancies.length}</span> Results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}