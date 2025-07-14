import Link from 'next/link'
import Image from 'next/image'
import { LANDING_NEWS } from '@/lib/constants'

export default function NewsSection() {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest News & Events
          </h2>
          <p className="text-xl text-gray-600">
            Stay updated with our latest activities and health information
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {LANDING_NEWS.map((news, index) => (
            <article 
              key={news.id} 
              className="card overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={news.image} 
                  alt={news.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">
                  {formatDate(news.date)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {news.description}
                </p>
                <Link 
                  href={`/news/${news.id}`} 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/news" className="btn-outline">
            View All News & Events
          </Link>
        </div>
      </div>
    </section>
  )
}