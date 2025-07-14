import Link from 'next/link'
import Image from 'next/image'
import { LANDING_DEPARTMENTS } from '@/lib/constants'

export default function DepartmentsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Departments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services with state-of-the-art facilities and expert medical professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LANDING_DEPARTMENTS.map((department, index) => (
            <div 
              key={department.id} 
              className="card overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={department.image} 
                  alt={department.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {department.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {department.description}
                </p>
                <Link 
                  href="/services" 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/services" className="btn-outline">
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  )
}