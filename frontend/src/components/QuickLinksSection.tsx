import Link from 'next/link'
import { Calendar, Heart, User, Briefcase } from 'lucide-react'

const quickLinks = [
  {
    title: 'Book OPD',
    description: 'Consult your doctor online or in-person',
    icon: Calendar,
    href: '/appointment',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Health Services',
    description: 'Explore diagnostic & specialty services',
    icon: Heart,
    href: '/services',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-600',
  },
  {
    title: 'Find a Doctor',
    description: 'Search specialists by name or department',
    icon: User,
    href: '/doctors',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-600',
  },
  {
    title: 'Careers',
    description: 'View current openings and apply online',
    icon: Briefcase,
    href: '/vacancies',
    bgColor: 'bg-yellow-50',
    iconBg: 'bg-yellow-500',
  },
]

export default function QuickLinksSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`${link.bgColor} p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${link.iconBg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {link.title}
                </h3>
                <p className="text-gray-600">
                  {link.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}