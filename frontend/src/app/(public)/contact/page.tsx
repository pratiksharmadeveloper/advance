'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Zap, 
  MessageCircle, 
  ChevronRight,
  Upload,
  Send
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/constants'

interface ContactForm {
  name: string
  contact: string
  subject: string
  message: string
  file?: File
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    contact: '',
    subject: '',
    message: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully!')
      setFormData({ name: '', contact: '', subject: '', message: '' })
      setSelectedFile(null)
      setIsSubmitting(false)
    }, 2000)
  }

  const validateForm = () => {
    return formData.name.trim() !== '' && 
           formData.contact.trim() !== '' && 
           formData.subject.trim() !== '' && 
           formData.message.trim() !== ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-blue-600">Contact</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80"
            alt="Hospital contact background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-600 opacity-75"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Get in touch with our team. We&apos;re here to help with any questions or concerns you may have.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
            <p className="text-lg text-gray-600">Multiple ways to reach us</p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Address */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
                <p className="text-gray-600">{CONTACT_INFO.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                <a 
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Hours</h3>
                <div className="text-gray-600">
                  <p>Mon-Fri: 8AM-6PM</p>
                  <p>Saturday: 8AM-2PM</p>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Emergency</h3>
                <a 
                  href={`tel:${CONTACT_INFO.emergency}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {CONTACT_INFO.emergency}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-blue-50">
              <div className="flex-shrink-0 mt-1 mr-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">WhatsApp</h3>
                <a 
                  href="https://wa.me/9779812345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Us</h2>
            <p className="text-lg text-gray-600">Visit our hospital location</p>
          </div>

          {/* Map Container */}
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-6" style={{ height: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456783724634!2d85.31677031506217!3d27.70588238279393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908434cb1c9%3A0x44a7c8d15c6b3f5f!2sSatdobato%2C%20Lalitpur%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Hospital Location Map - Satdobato, Lalitpur, Nepal"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          {/* Get Directions Button */}
          <div className="text-center">
            <a
              href="https://www.google.com/maps/dir//Satdobato,+Lalitpur+44600,+Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-lg text-gray-600">We&apos;ll get back to you as soon as possible</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email/Phone Field */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="your@email.com or +977-XXXXXXXXXX"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="Message subject"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="Your message here..."
                />
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach File (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    <span>Choose File</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!validateForm() || isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is available 24/7 for emergencies and urgent inquiries
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`tel:${CONTACT_INFO.emergency}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Emergency: {CONTACT_INFO.emergency}
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call: {CONTACT_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}