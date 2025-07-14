'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, 
  Calendar, 
  Bell,
  Clock,
  User,
  ArrowRight
} from 'lucide-react'
import { NEWS_ITEMS } from '@/lib/constants'

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleNews, setVisibleNews] = useState(6) // Initially show 6 articles
  const [subscribedEmail, setSubscribedEmail] = useState('')

  // Filter news based on search term
  const filteredNews = NEWS_ITEMS.filter(news =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get current visible news
  const currentNews = filteredNews.slice(0, visibleNews)
  const hasMoreNews = visibleNews < filteredNews.length

  const handleLoadMore = () => {
    setVisibleNews(prev => prev + 3)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (subscribedEmail.trim()) {
      alert(`Subscribed successfully with email: ${subscribedEmail}`)
      setSubscribedEmail('')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get featured article (most recent)
  const featuredArticle = NEWS_ITEMS[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80"
            alt="Hospital news background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-600 opacity-75"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Heading and Description */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              News & Events
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Stay updated with our latest news, events, and health awareness initiatives.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-3 rounded-md font-medium"
            >
              Subscribe for Updates
            </button>
            <button 
              onClick={() => document.getElementById('news-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Read Articles
            </button>
          </div>
        </div>
      </section>

      {/* Search and Calendar Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-6 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Search news, events, articles..."
              />
            </div>
            
            {/* Calendar View Button */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap">
              <Calendar className="h-5 w-5" />
              Calendar View
            </button>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Event Image */}
            <div className="w-full md:w-2/5">
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Event Content */}
            <div className="w-full md:w-3/5">
              {/* Featured Event Label */}
              <div className="mb-4">
                <span className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Featured Event
                </span>
              </div>
              
              {/* Event Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {featuredArticle.title}
              </h2>
              
              {/* Event Description */}
              <p className="text-lg text-gray-600 mb-6">
                {featuredArticle.description}
              </p>
              
              {/* Event Details */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{formatDate(featuredArticle.date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Dr. Sarah Johnson</span>
                </div>
              </div>
              
              {/* Read More Button */}
              <Link 
                href={`/news/${featuredArticle.id}`}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Read Full Article
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest News & Events
            </h2>
            <p className="text-lg text-gray-600">
              {searchTerm 
                ? `Showing ${filteredNews.length} result${filteredNews.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : 'Stay informed with our latest updates and health information'
              }
            </p>
          </div>

          {/* News Cards Grid */}
          <div id="news-grid" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentNews.map((news) => (
              <article 
                key={news.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      NEWS
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(news.date)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.description}
                  </p>
                  <Link
                    href={`/news/${news.id}`}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors inline-flex items-center"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMoreNews && (
            <div className="text-center mt-10">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                + Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section id="subscribe-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Bell className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100">
              Subscribe to our newsletter and never miss important health updates and hospital news
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>

      {/* Health Tips CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Looking for Health Tips?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Check out our comprehensive health guides and expert advice
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/news?category=health-tips"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Health Tips
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Ask Our Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}