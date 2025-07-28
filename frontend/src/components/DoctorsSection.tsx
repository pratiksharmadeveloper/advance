import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { FEATURED_DOCTORS } from '@/lib/constants'

export default function DoctorsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Doctors
          </h2>
          <p className="text-xl text-gray-600">
            Expert healthcare professionals dedicated to your wellbeing
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURED_DOCTORS.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className="card overflow-hidden text-center group animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-lg text-blue-600 mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-gray-600 mb-4">
                  {doctor.experience}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{doctor.rating}</span>
                </div>
                <Link 
                  href="/appointment" 
                  className="btn-secondary inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/doctors" className="btn-outline">
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  )
}