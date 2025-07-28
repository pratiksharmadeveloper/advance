import Link from 'next/link'

export default function CareersSection() {
  return (
    <section className="section-padding bg-blue-600 text-white"> 
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We are Hiring!
          </h2>
          <p className="text-xl">
            Join our team of healthcare professionals making a difference in the lives of people.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mb-10 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Registered Nurse
          </h3>
          <p className="text-gray-600 mb-6">
            ICU Department - Full Time Position
          </p>
          <div className="flex justify-center">
            <Link href="/vacancies" className="btn-primary">
              Apply Now
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/vacancies" 
            className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 font-medium transition-colors"
          >
            View All Vacancies
          </Link>
        </div>
      </div>
    </section>
  )
}