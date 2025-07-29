import * as yup from 'yup';
import { UserRole } from '../entities/User';
import { AppointmentStatus, AppointmentType } from '../entities/Appointment';

// User validation schemas
export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Valid email is required').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(Object.values(UserRole), 'Invalid role').default(UserRole.PATIENT),
  phoneNumber: yup.string().optional(),
  address: yup.string().optional()
});

export const loginSchema = yup.object({
  email: yup.string().email('Valid email is required').required('Email is required'),
  password: yup.string().required('Password is required')
});

export const updateProfileSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').optional(),
  phoneNumber: yup.string().optional(),
  address: yup.string().optional(),
  profileImage: yup.string().url('Valid URL is required').optional()
});

// Appointment validation schemas
export const createAppointmentSchema = yup.object({
  appointmentDate: yup.date().required('Appointment date is required').min(new Date(), 'Appointment date cannot be in the past'),
  type: yup.string().oneOf(Object.values(AppointmentType), 'Invalid appointment type').required('Appointment type is required'),
  symptoms: yup.string().optional(),
  doctorId: yup.string().uuid('Valid doctor ID is required').required('Doctor ID is required'),
  patientId: yup.string().uuid('Valid patient ID is required').required('Patient ID is required'),
  notes: yup.string().optional(),
  fee: yup.number().positive('Fee must be positive').optional()
});

export const updateAppointmentSchema = yup.object({
  appointmentDate: yup.date().min(new Date(), 'Appointment date cannot be in the past').optional(),
  type: yup.string().oneOf(Object.values(AppointmentType), 'Invalid appointment type').optional(),
  symptoms: yup.string().optional(),
  diagnosis: yup.string().optional(),
  prescription: yup.string().optional(),
  notes: yup.string().optional(),
  fee: yup.number().positive('Fee must be positive').optional()
});

export const updateAppointmentStatusSchema = yup.object({
  status: yup.string().oneOf(Object.values(AppointmentStatus), 'Invalid status').required('Status is required')
});

// Doctor validation schemas
export const createDoctorSchema = yup.object({
  specialization: yup.string().required('Specialization is required').min(2, 'Specialization must be at least 2 characters'),
  qualifications: yup.string().required('Qualifications are required').min(10, 'Qualifications must be at least 10 characters'),
  bio: yup.string().optional(),
  licenseNumber: yup.string().required('License number is required'),
  consultationFee: yup.number().positive('Consultation fee must be positive').required('Consultation fee is required'),
  experienceYears: yup.number().min(0, 'Experience years cannot be negative').default(0),
  workingHours: yup.object().optional()
});

export const updateDoctorSchema = yup.object({
  specialization: yup.string().min(2, 'Specialization must be at least 2 characters').optional(),
  qualifications: yup.string().min(10, 'Qualifications must be at least 10 characters').optional(),
  bio: yup.string().optional(),
  licenseNumber: yup.string().optional(),
  consultationFee: yup.number().positive('Consultation fee must be positive').optional(),
  experienceYears: yup.number().min(0, 'Experience years cannot be negative').optional(),
  workingHours: yup.object().optional(),
  isAvailable: yup.boolean().optional()
});

// Patient validation schemas
export const createPatientSchema = yup.object({
  dateOfBirth: yup.date().max(new Date(), 'Date of birth cannot be in the future').required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required('Gender is required'),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group').optional(),
  medicalHistory: yup.string().optional(),
  allergies: yup.string().optional(),
  currentMedications: yup.string().optional(),
  emergencyContact: yup.string().required('Emergency contact is required'),
  emergencyPhone: yup.string().required('Emergency phone is required'),
  insuranceInfo: yup.object().optional()
});

export const updatePatientSchema = yup.object({
  dateOfBirth: yup.date().max(new Date(), 'Date of birth cannot be in the future').optional(),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group').optional(),
  medicalHistory: yup.string().optional(),
  allergies: yup.string().optional(),
  currentMedications: yup.string().optional(),
  emergencyContact: yup.string().optional(),
  emergencyPhone: yup.string().optional(),
  insuranceInfo: yup.object().optional()
});

// News validation schemas
export const createNewsSchema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  content: yup.string().required('Content is required').min(20, 'Content must be at least 20 characters'),
  summary: yup.string().max(500, 'Summary must be less than 500 characters').optional(),
  imageUrl: yup.string().url('Valid URL is required').optional(),
  tags: yup.array().of(yup.string()).optional(),
  isPublished: yup.boolean().default(true)
});

export const updateNewsSchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters').optional(),
  content: yup.string().min(20, 'Content must be at least 20 characters').optional(),
  summary: yup.string().max(500, 'Summary must be less than 500 characters').optional(),
  imageUrl: yup.string().url('Valid URL is required').optional(),
  tags: yup.array().of(yup.string()).optional(),
  isPublished: yup.boolean().optional()
});

// Vacancy validation schemas
export const createVacancySchema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  department: yup.string().required('Department is required').min(2, 'Department must be at least 2 characters'),
  location: yup.string().required('Location is required').min(2, 'Location must be at least 2 characters'),
  requirements: yup.string().optional(),
  responsibilities: yup.string().optional(),
  salary: yup.number().positive('Salary must be positive').optional(),
  experienceRequired: yup.number().min(0, 'Experience required cannot be negative').optional(),
  benefits: yup.array().of(yup.string()).optional(),
  deadline: yup.date().min(new Date(), 'Deadline cannot be in the past').optional()
});

export const updateVacancySchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters').optional(),
  description: yup.string().min(20, 'Description must be at least 20 characters').optional(),
  department: yup.string().min(2, 'Department must be at least 2 characters').optional(),
  location: yup.string().min(2, 'Location must be at least 2 characters').optional(),
  requirements: yup.string().optional(),
  responsibilities: yup.string().optional(),
  salary: yup.number().positive('Salary must be positive').optional(),
  experienceRequired: yup.number().min(0, 'Experience required cannot be negative').optional(),
  benefits: yup.array().of(yup.string()).optional(),
  deadline: yup.date().min(new Date(), 'Deadline cannot be in the past').optional()
});

// Message validation schemas
export const createMessageSchema = yup.object({
  content: yup.string().required('Message content is required').min(1, 'Message cannot be empty'),
  subject: yup.string().optional(),
  receiverId: yup.string().uuid('Valid receiver ID is required').required('Receiver ID is required')
});

export const updateMessageSchema = yup.object({
  content: yup.string().min(1, 'Message cannot be empty').optional(),
  subject: yup.string().optional()
});

// Query parameter schemas
export const dateRangeSchema = yup.object({
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date')
});

export const paginationSchema = yup.object({
  page: yup.number().min(1, 'Page must be at least 1').default(1),
  limit: yup.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10)
}); 
