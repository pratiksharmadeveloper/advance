import { Star } from 'lucide-react'

const testimonials = [
  {
    id: '1',
    name: 'Mary Wilson',
    age: '45',
    content: 'Excellent care and professional staff. The doctors were very attentive and thorough.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Robert Davis',
    age: '52',
    content: 'State-of-the-art facilities and compassionate healthcare. Highly recommended!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Lisa Anderson',
    age: '38',
    content: 'Quick appointment booking and minimal waiting time. Great overall experience.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600">
            Real experiences from our valued patients
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-50 p-8 rounded-lg text-center animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex justify-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {testimonial.name}
              </h3>
              <p className="text-gray-500 mb-4">
                Age {testimonial.age}
              </p>
              <blockquote className="text-gray-600 italic">
                 &ldquo;{testimonial.content}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}