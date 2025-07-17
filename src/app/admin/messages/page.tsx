// src/app/admin/messages/page.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

export default function MessagesPage() {
  const [selectedMessages, setSelectedMessages] = useState<number[]>([])
  
  const messages = [
    {
      id: 1,
      name: "Ramesh Adhikari",
      email: "ramesh@gmail.com",
      phone: "98XXXXXXX",
      subject: "Appointment Inquiry",
      message: "Hello, I'd like to book...",
      date: "June 5, 2025",
      status: "New",
      statusVariant: "primary" as const
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "97XXXXXXX",
      subject: "General Inquiry",
      message: "What are your visiting hours...",
      date: "June 4, 2025",
      status: "Replied",
      statusVariant: "success" as const
    },
    {
      id: 3,
      name: "Suresh Thapa",
      email: "suresh@gmail.com",
      phone: "98XXXXXXX",
      subject: "Feedback",
      message: "Great service, thank you...",
      date: "June 3, 2025",
      status: "Read",
      statusVariant: "secondary" as const
    }
  ]

  const toggleMessage = (id: number) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    )
  }

  const toggleAllMessages = () => {
    setSelectedMessages(prev => 
      prev.length === messages.length ? [] : messages.map(msg => msg.id)
    )
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Contact Messages</h2>
            <p className="text-gray-600 mt-1">Manage patient inquiries and feedback</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              disabled={selectedMessages.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({selectedMessages.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <Input 
              placeholder="Search by title or content..." 
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" size="md">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Calendar
            </Button>
            <Button variant="outline" size="md">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Messages ({messages.length})</h3>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedMessages.length === messages.length}
                      onChange={toggleAllMessages}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => toggleMessage(message.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{message.email}</div>
                      <div className="text-sm text-gray-500">{message.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{message.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={message.statusVariant} size="sm">
                        {message.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {messages.map((message) => (
              <div key={message.id} className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-3"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => toggleMessage(message.id)}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                      <div className="text-sm text-gray-500">{message.email}</div>
                      <div className="text-sm text-gray-500">{message.phone}</div>
                    </div>
                  </div>
                  <Badge variant={message.statusVariant} size="sm">
                    {message.status}
                  </Badge>
                </div>
                <div className="ml-7 mb-2">
                  <div className="text-sm font-medium text-gray-900 mb-1">{message.subject}</div>
                  <div className="text-sm text-gray-500">{message.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{message.date}</div>
                </div>
                <div className="ml-7 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Reply</button>
                  <button className="text-green-600 hover:text-green-900 text-sm">Mark Read</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">24</span> results
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Previous</Button>
                <Button size="sm" variant="primary">1</Button>
                <Button size="sm" variant="outline">2</Button>
                <Button size="sm" variant="outline">3</Button>
                <Button size="sm" variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}