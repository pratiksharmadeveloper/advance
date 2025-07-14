import { NavItem, Doctor, Department, NewsItem } from './types'

export const SITE_CONFIG = {
  name: "Advance International Hospital",
  description: "Your Health, Our Priority. Providing world-class healthcare services with compassion and excellence.",
}

export const NAVIGATION: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
]

export const CONTACT_INFO = {
  address: "Satabbato, Lalitpur Nepal",
  phone: "+977-1-XXXXXXX",
  email: "info@aihospital.com",
  emergency: "+977-98XXXXXXXX",
}

export const ALL_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sushil Shrestha',
    specialty: 'Cardiology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    experience: '15+ years experience',
    qualification: 'MBBS, MD - Internal Medicine',
    department: 'Cardiology',
    branch: 'Satabbato Branch',
    reviews: 124,
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    specialty: 'Neurology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    experience: '12+ years experience',
    qualification: 'MBBS, MS - Neurosurgery',
    department: 'Neurology',
    branch: 'Main Branch',
    reviews: 89,
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedics',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.7,
    experience: '18+ years experience',
    qualification: 'MBBS, MS - Orthopedic Surgery',
    department: 'Orthopedics',
    branch: 'Satabbato Branch',
    reviews: 156,
  },
  {
    id: '4',
    name: 'Dr. Emily Davis',
    specialty: 'Pediatrics',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.9,
    experience: '10+ years experience',
    qualification: 'MBBS, MD - Pediatrics',
    department: 'Pediatrics',
    branch: 'Main Branch',
    reviews: 203,
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    specialty: 'Emergency Medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
    rating: 4.6,
    experience: '14+ years experience',
    qualification: 'MBBS, MD - Emergency Medicine',
    department: 'Emergency',
    branch: 'Both Branches',
    reviews: 167,
  },
  {
    id: '6',
    name: 'Dr. Lisa Anderson',
    specialty: 'Radiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
    rating: 4.8,
    experience: '16+ years experience',
    qualification: 'MBBS, MD - Radiology',
    department: 'Radiology',
    branch: 'Main Branch',
    reviews: 134,
  },
  {
    id: '7',
    name: 'Dr. Robert Kumar',
    specialty: 'General Surgery',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.5,
    experience: '20+ years experience',
    qualification: 'MBBS, MS - General Surgery',
    department: 'Surgery',
    branch: 'Main Branch',
    reviews: 98,
  },
  {
    id: '8',
    name: 'Dr. Maria Rodriguez',
    specialty: 'Dermatology',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
    rating: 4.7,
    experience: '8+ years experience',
    qualification: 'MBBS, MD - Dermatology',
    department: 'Dermatology',
    branch: 'Satabbato Branch',
    reviews: 145,
  },
  {
    id: '9',
    name: 'Dr. Ahmed Hassan',
    specialty: 'Psychiatry',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    rating: 4.8,
    experience: '13+ years experience',
    qualification: 'MBBS, MD - Psychiatry',
    department: 'Psychiatry',
    branch: 'Both Branches',
    reviews: 187,
  },
]

export const DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Advanced heart care and treatment',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
  {
    id: '2',
    name: 'Neurology',
    description: 'Brain and nervous system care',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
  {
    id: '3',
    name: 'Radiology',
    description: 'Advanced imaging and diagnostics',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
  {
    id: '4',
    name: 'Emergency',
    description: '24/7 emergency medical care',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
  {
    id: '5',
    name: 'Orthopedics',
    description: 'Bone, joint, and muscle care',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
  {
    id: '6',
    name: 'Pediatrics',
    description: 'Comprehensive child healthcare',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
  },
]

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '6',
    title: 'Mental Health Awareness Week',
    description: 'Special programs and consultations for mental health',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-04-15',
  },
  {
    id: '5',
    title: 'COVID-19 Vaccination Drive',
    description: 'Free vaccination camp for all age groups',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-04-10',
  },
  {
    id: '4',
    title: 'New Cardiac Center Opening',
    description: 'State-of-the-art cardiac center opens at Satabbato branch',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-04-01',
  },
  {
    id: '3',
    title: 'Health Tips',
    description: 'Essential tips for maintaining a healthy lifestyle',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-03-25',
  },
  {
    id: '2',
    title: 'Medical Conference',
    description: 'Annual medical conference on latest healthcare innovations',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-03-20',
  },
  {
    id: '1',
    title: 'Free Health Camp',
    description: 'Join our monthly health screening camp for the community',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    date: '2024-03-15',
  },
]

// Landing page specific arrays
export const FEATURED_DOCTORS: Doctor[] = ALL_DOCTORS.slice(0, 3)
export const LANDING_DEPARTMENTS: Department[] = DEPARTMENTS.slice(0, 4)
export const LANDING_NEWS: NewsItem[] = NEWS_ITEMS.slice(0, 3)

export const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Emergency Medicine',
  'Radiology',
  'General Surgery',
  'Dermatology',
  'Psychiatry',
  'Internal Medicine',
  'Gynecology',
  'Ophthalmology',
]

export const BRANCHES = [
  'Main Branch',
  'Satabbato Branch',
  'Both Branches',
]