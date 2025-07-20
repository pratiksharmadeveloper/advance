// src/lib/constants.ts

// Type definitions
export interface NavItem {
  name: string;
  href: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  qualification: string;
  department: string;
  branch: string;
  reviews: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Site configuration
export const SITE_CONFIG = {
  name: 'Advance International Hospital',
  description: 'Your Health, Our Priority. Providing world-class healthcare services with compassion and excellence.',
  url: 'https://advancedhospital.com.np',
} as const;

// Navigation
export const NAVIGATION: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

// Contact information
export const CONTACT_INFO = {
  address: 'Satabbato, Lalitpur Nepal',
  phone: '+977-1-XXXXXXX',
  email: 'info@aihospital.com',
  emergency: '+977-98XXXXXXXX',
  emergencyPhone: '+977-1-5970002',
  ambulancePhone: '+977-1-5970003',
} as const;

// Doctors data
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
];

// Departments data
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
];

// News data
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
];

// Landing page arrays
export const FEATURED_DOCTORS: Doctor[] = ALL_DOCTORS.slice(0, 3);
export const LANDING_DEPARTMENTS: Department[] = DEPARTMENTS.slice(0, 4);
export const LANDING_NEWS: NewsItem[] = NEWS_ITEMS.slice(0, 3);

// Filter options
export const SPECIALTIES: readonly string[] = [
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
] as const;

export const BRANCHES: readonly string[] = [
  'Main Branch',
  'Satabbato Branch',
  'Both Branches',
] as const;

// Social links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/advancedhospital',
  twitter: 'https://twitter.com/advancedhospital',
  instagram: 'https://instagram.com/advancedhospital',
  linkedin: 'https://linkedin.com/company/advancedhospital',
} as const;

// Navigation links
export const NAVIGATION_LINKS = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Departments', href: '/departments' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'Services', href: '/services' },
    { name: 'News', href: '/news' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ],
  patient: [
    { name: 'Dashboard', href: '/patient/dashboard' },
    { name: 'Appointments', href: '/patient/appointments' },
    { name: 'Medical Records', href: '/patient/records' },
    { name: 'Billing', href: '/patient/billing' },
    { name: 'Profile', href: '/patient/profile' }
  ],
  admin: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Appointments', href: '/admin/appointments' },
    { name: 'Patients', href: '/admin/patients' },
    { name: 'Doctors', href: '/admin/doctors' },
    { name: 'Departments', href: '/admin/departments' },
    { name: 'News', href: '/admin/news' },
    { name: 'Messages', href: '/admin/messages' },
    { name: 'Reports', href: '/admin/reports' },
    { name: 'Settings', href: '/admin/settings' }
  ]
} as const;

// Appointment slots
export const APPOINTMENT_SLOTS = {
  morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  afternoon: ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'],
  evening: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
} as const;

// Services
export const SERVICES = [
  {
    id: 'consultation',
    name: 'Medical Consultation',
    description: 'Expert medical consultation with our experienced doctors',
    price: 'Rs. 1,500'
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic Services',
    description: 'Comprehensive diagnostic tests and imaging services',
    price: 'Rs. 500 - Rs. 15,000'
  },
  {
    id: 'surgery',
    name: 'Surgical Procedures',
    description: 'Advanced surgical procedures with modern equipment',
    price: 'Rs. 50,000+'
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: '24/7 emergency medical services',
    price: 'Rs. 2,500'
  }
] as const;

// FAQ
export const FAQ = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment through our patient portal, by calling our helpline, or by visiting the hospital reception.'
  },
  {
    question: 'What documents do I need to bring?',
    answer: 'Please bring a valid ID, insurance card (if applicable), and any previous medical records or test results.'
  },
  {
    question: 'What are your visiting hours?',
    answer: 'General visiting hours are 10 AM to 8 PM. ICU visiting hours are 4 PM to 6 PM with restricted access.'
  },
  {
    question: 'Do you accept insurance?',
    answer: 'Yes, we accept most major insurance plans. Please contact our billing department for specific coverage details.'
  },
  {
    question: 'How can I access my medical records?',
    answer: 'You can access your medical records through the patient portal or by requesting them at the medical records department.'
  },
  {
    question: 'What should I do in case of emergency?',
    answer: 'For medical emergencies, call our emergency number +977-98XXXXXXXX or visit our 24/7 emergency department.'
  }
] as const;