// src/app/admin/news/page.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

interface Article {
  id: number
  title: string
  description: string
  type: string
  publishedDate: string | null
  status: 'Published' | 'Draft'
  featured: boolean
  featuredPosition?: number
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [articles] = useState<Article[]>([
    {
      id: 1,
      title: 'Free Health Camp - June 2025',
      description: 'Community health screening and consultation',
      type: 'Event',
      publishedDate: 'June 5, 2025',
      status: 'Published',
      featured: true,
      featuredPosition: 1
    },
    {
      id: 2,
      title: 'Heart Health Awareness Week',
      description: 'Tips for maintaining cardiovascular health',
      type: 'Awareness',
      publishedDate: 'June 1, 2025',
      status: 'Published',
      featured: true,
      featuredPosition: 2
    },
    {
      id: 3,
      title: 'New Cardiology Wing Opening',
      description: 'State-of-the-art cardiac care facility launched',
      type: 'News',
      publishedDate: 'May 28, 2025',
      status: 'Published',
      featured: true,
      featuredPosition: 3
    },
    {
      id: 4,
      title: 'Diabetes Prevention Guidelines',
      description: 'Essential tips for diabetes prevention and management',
      type: 'Awareness',
      publishedDate: null,
      status: 'Draft',
      featured: false
    }
  ])

  const featuredArticles = articles.filter(article => article.featured).sort((a, b) => (a.featuredPosition || 0) - (b.featuredPosition || 0))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">News & Activities Management</h1>
          <Badge variant="info">Admin Panel</Badge>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Article
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <Input 
            placeholder="Search by title or content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Featured Articles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Featured Articles ({featuredArticles.length}/3)</h2>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="border-l-4 border-blue-500">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="primary" size="sm">Featured #{article.featuredPosition}</Badge>
                  <Badge variant="success" size="sm">Published</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{article.title}</h3>
                <p className="text-sm text-gray-500">{article.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Articles Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-700">All Articles</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              {/* Table Header - Desktop */}
              <thead className="hidden md:table-header-group">
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Published Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Featured</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {/* Desktop View */}
                    <td className="hidden md:table-cell px-6 py-4">
                      <p className="font-medium text-gray-800">{article.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{article.description}</p>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">{article.type}</td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                      {article.publishedDate || '-'}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <Badge 
                        variant={article.status === 'Published' ? 'success' : 'secondary'} 
                        size="sm"
                      >
                        {article.status}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <Badge 
                        variant={article.featured ? 'primary' : 'secondary'} 
                        size="sm"
                      >
                        {article.featured ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="View">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800" title="Edit">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        {article.status === 'Draft' ? (
                          <button className="text-green-600 hover:text-green-800" title="Publish">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ) : (
                          <button className="text-red-600 hover:text-red-800" title="Cancel">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    {/* Mobile View */}
                    <td className="md:hidden px-4 py-4 w-full">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{article.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{article.description}</p>
                            <p className="text-sm text-gray-600 mt-2">{article.type} • {article.publishedDate || 'Not published'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge 
                              variant={article.status === 'Published' ? 'success' : 'secondary'} 
                              size="sm"
                            >
                              {article.status}
                            </Badge>
                            {article.featured && (
                              <Badge variant="primary" size="sm">Featured</Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">Showing 1 to 4 of 24 results</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">Previous</Button>
              <Button size="sm" variant="outline">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}