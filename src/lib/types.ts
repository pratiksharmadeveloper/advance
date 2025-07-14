export interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  experience: string
  qualification?: string
  department?: string
  branch?: string
  reviews?: number
}

export interface Department {
  id: string
  name: string
  description: string
  image: string
}

export interface NewsItem {
  id: string
  title: string
  description: string
  image: string
  date: string
}

export interface NavItem {
  name: string
  href: string
}

export interface Appointment {
  doctorId: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  date: string
  time: string
}

export interface ContactForm {
  name: string
  contact: string
  subject: string
  message: string
  file?: File
}

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  deadline: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string[]
}