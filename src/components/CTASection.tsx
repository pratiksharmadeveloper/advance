import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="bg-blue-600 text-white section-padding">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Get expert care when you need it
        </h3>
        <p className="text-xl mb-6">
          Book your appointment today and experience world-class healthcare
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/appointment" className="btn-secondary">
            Book OPD
          </Link>
          <Link 
            href="tel:+977-XXXXXXX" 
            className="border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 font-medium transition-colors"
          >
            Call Now +977-XXXXXXX
          </Link>
        </div>
      </div>
    </section>
  )
}