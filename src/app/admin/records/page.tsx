'use client'

import React, { useState } from 'react'

interface PatientRecord {
  id: string
  patientId: string
  name: string
  age: number
  gender: string
  contact: string
  lastVisit: string
  registered: string
}

export default function PatientRecordsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const [patients] = useState<PatientRecord[]>([
    {
      id: '1',
      patientId: 'AIH-00123',
      name: 'Sita Sharma',
      age: 34,
      gender: 'Female',
      contact: '980XXXXXXXX',
      lastVisit: 'May 28, 2025',
      registered: 'Jan 12, 2024'
    },
    {
      id: '2',
      patientId: 'AIH-00124',
      name: 'Ram Prasad',
      age: 45,
      gender: 'Male',
      contact: '981XXXXXXXX',
      lastVisit: 'May 25, 2025',
      registered: 'Feb 05, 2024'
    },
    {
      id: '3',
      patientId: 'AIH-00125',
      name: 'Maya Gurung',
      age: 28,
      gender: 'Female',
      contact: '982XXXXXXXX',
      lastVisit: 'June 02, 2025',
      registered: 'Mar 15, 2024'
    },
    {
      id: '4',
      patientId: 'AIH-00126',
      name: 'Krishna Oli',
      age: 52,
      gender: 'Male',
      contact: '983XXXXXXXX',
      lastVisit: 'May 30, 2025',
      registered: 'Jan 20, 2024'
    }
  ])

  const handleAddPatient = () => {
    console.log('Add new patient')
  }

  const handleView = (id: string) => {
    console.log('View patient:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit patient:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete patient:', id)
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm)
    
    const matchesDate = !dateFilter || 
      patient.lastVisit.includes(dateFilter) || 
      patient.registered.includes(dateFilter)
    
    return matchesSearch && matchesDate
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Records</h1>
          <p className="text-gray-600 mt-1">Manage patient profiles and medical history</p>
        </div>
        <button 
          onClick={handleAddPatient}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <i className="fas fa-plus"></i>
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="Search by name, phone, or ID..."
            />
          </div>
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="fas fa-calendar-alt text-gray-400"></i>
            </div>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800">Patient Database</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Patient ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Age/Gender</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Last Visit</th>
                <th scope="col" className="px-6 py-3">Registered</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{patient.patientId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4">{patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4">{patient.contact}</td>
                  <td className="px-6 py-4">{patient.lastVisit}</td>
                  <td className="px-6 py-4">{patient.registered}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(patient.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Patient"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => handleEdit(patient.id)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit Patient"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Patient"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-search text-gray-300 text-3xl mb-2"></i>
                      <p>No patients found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> patients
            </p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}