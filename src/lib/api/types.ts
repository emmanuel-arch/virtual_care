// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'patient' | 'practitioner';
  state: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

// Practitioner Types
export interface Practitioner {
  id: string;
  user_id: string;
  license_number: string;
  license_state: string;
  bio?: string;
  years_of_experience?: number;
  education?: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  // Joined data
  full_name?: string;
  email?: string;
  phone_number?: string;
  services?: Service[];
  availability?: Availability[];
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration_minutes: number;
  price?: number;
  created_at: string;
}

// Practitioner Service Junction
export interface PractitionerService {
  id: string;
  practitioner_id: string;
  service_id: string;
  custom_price?: number;
  custom_duration?: number;
  service?: Service;
}

// Availability Types
export interface Availability {
  id: string;
  practitioner_id: string;
  day_of_week: number; // 0-6, Sunday = 0
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
}

// Appointment Types
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patient_id: string;
  practitioner_id: string;
  service_id?: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  video_room_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  patient?: User;
  practitioner?: Practitioner;
  service?: Service;
}

// Message Types
export interface Message {
  id: string;
  conversation_id?: string;
  appointment_id?: string;
  sender_id: string;
  sender_type?: 'patient' | 'practitioner';
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  sender?: User;
}

// Conversation (grouped messages by appointment)
export interface Conversation {
  id?: string;
  appointment_id?: string;
  patient_id?: string;
  practitioner_id?: string;
  appointment?: Appointment;
  messages?: Message[];
  unread_count?: number;
  last_message?: Message;
  created_at?: string;
  updated_at?: string;
}

// Review Types
export interface Review {
  id: string;
  appointment_id: string;
  patient_id: string;
  practitioner_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  // Joined data
  patient?: User;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface PatientDashboardStats {
  upcoming_appointments: number;
  unread_messages: number;
  past_consultations: number;
  favorite_practitioners: number;
}

export interface PractitionerDashboardStats {
  today_appointments: number;
  upcoming_appointments: number;
  unread_messages: number;
  total_patients: number;
  average_rating: number;
  total_reviews: number;
}

// Booking Types
export interface BookingSlot {
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BookingRequest {
  practitioner_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}
