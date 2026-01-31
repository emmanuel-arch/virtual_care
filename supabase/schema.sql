-- VirtualCare Platform Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kroauhjawrfgfqckfpmd/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'practitioner')),
  state VARCHAR(100),
  phone_number VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- =====================================================
-- PRACTITIONERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS practitioners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(100) NOT NULL,
  license_state VARCHAR(100) NOT NULL,
  bio TEXT,
  years_of_experience INTEGER,
  education VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  languages TEXT[], -- Array of languages spoken
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practitioners_user_id ON practitioners(user_id);
CREATE INDEX IF NOT EXISTS idx_practitioners_verified ON practitioners(is_verified);
CREATE INDEX IF NOT EXISTS idx_practitioners_rating ON practitioners(rating DESC);
CREATE INDEX IF NOT EXISTS idx_practitioners_license_state ON practitioners(license_state);

-- =====================================================
-- SERVICES TABLE (Consultation Types)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, description, category, duration_minutes, base_price) VALUES
  ('General Consultation', 'Standard medical consultation for general health concerns', 'Primary Care', 30, 75.00),
  ('Follow-up Visit', 'Follow-up on previous consultation or treatment', 'Primary Care', 15, 45.00),
  ('Wellness Checkup', 'Comprehensive health assessment and preventive care consultation', 'Preventive', 45, 120.00),
  ('Chronic Care Management', 'Ongoing management for chronic conditions', 'Chronic Care', 30, 85.00),
  ('Mental Health Consultation', 'Initial mental health assessment and consultation', 'Mental Health', 60, 150.00),
  ('Therapy Session', 'Individual therapy session', 'Mental Health', 50, 130.00),
  ('Dermatology Consultation', 'Skin condition assessment and treatment plan', 'Dermatology', 30, 95.00),
  ('Nutrition Counseling', 'Personalized nutrition and diet planning', 'Wellness', 45, 80.00),
  ('Pediatric Consultation', 'Healthcare consultation for children', 'Pediatrics', 30, 85.00),
  ('Urgent Care', 'Same-day consultation for urgent health issues', 'Urgent Care', 20, 100.00)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SPECIALTIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default specialties
INSERT INTO specialties (name, description, icon_name) VALUES
  ('Internal Medicine', 'General adult medicine and primary care', 'stethoscope'),
  ('Family Medicine', 'Comprehensive healthcare for all ages', 'users'),
  ('Pediatrics', 'Medical care for infants, children, and adolescents', 'baby'),
  ('Dermatology', 'Skin, hair, and nail conditions', 'scan'),
  ('Psychiatry', 'Mental health diagnosis and treatment', 'brain'),
  ('Psychology', 'Mental health therapy and counseling', 'heart'),
  ('Cardiology', 'Heart and cardiovascular system', 'heart-pulse'),
  ('Endocrinology', 'Hormonal and metabolic disorders', 'activity'),
  ('Gastroenterology', 'Digestive system disorders', 'pill'),
  ('Neurology', 'Brain and nervous system disorders', 'zap'),
  ('Orthopedics', 'Bone, joint, and muscle conditions', 'bone'),
  ('OB/GYN', 'Women''s reproductive health', 'baby'),
  ('Urology', 'Urinary tract and male reproductive health', 'droplet'),
  ('Pulmonology', 'Lung and respiratory conditions', 'wind'),
  ('Rheumatology', 'Autoimmune and joint diseases', 'activity'),
  ('Allergy & Immunology', 'Allergies and immune system disorders', 'shield'),
  ('Nutrition', 'Diet and nutritional counseling', 'apple'),
  ('Physical Therapy', 'Movement and rehabilitation', 'move')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- PRACTITIONER_SERVICES (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS practitioner_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  custom_price DECIMAL(10, 2),
  custom_duration INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practitioner_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_practitioner_services_practitioner ON practitioner_services(practitioner_id);

-- =====================================================
-- PRACTITIONER_SPECIALTIES (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS practitioner_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practitioner_id, specialty_id)
);

CREATE INDEX IF NOT EXISTS idx_practitioner_specialties_practitioner ON practitioner_specialties(practitioner_id);

-- =====================================================
-- AVAILABILITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_practitioner ON availability(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  cancellation_reason TEXT,
  video_room_id VARCHAR(255),
  video_room_url TEXT,
  amount DECIMAL(10, 2),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_practitioner ON appointments(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_upcoming ON appointments(appointment_date, start_time) WHERE status IN ('scheduled', 'confirmed');

-- =====================================================
-- CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, practitioner_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_patient ON conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_practitioner ON conversations(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('patient', 'practitioner')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  practitioner_response TEXT,
  response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_practitioner ON reviews(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_patient ON reviews(patient_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- =====================================================
-- PATIENT_PRACTITIONERS (Favorites/My Practitioners)
-- =====================================================
CREATE TABLE IF NOT EXISTS patient_practitioners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, practitioner_id)
);

CREATE INDEX IF NOT EXISTS idx_patient_practitioners_patient ON patient_practitioners(patient_id);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'appointment_reminder', 'new_message', 'appointment_confirmed', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like appointment_id, conversation_id
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- =====================================================
-- VIDEO_ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS video_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  room_id VARCHAR(255) UNIQUE NOT NULL,
  room_url TEXT NOT NULL,
  host_url TEXT,
  status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'active', 'ended')),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_rooms_appointment ON video_rooms(appointment_id);
CREATE INDEX IF NOT EXISTS idx_video_rooms_room_id ON video_rooms(room_id);

-- =====================================================
-- HEALTH_RECORDS TABLE (Basic)
-- =====================================================
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_type VARCHAR(50) NOT NULL, -- 'allergy', 'medication', 'condition', 'note'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_type ON health_records(record_type);

-- =====================================================
-- CONSULTATION_NOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS consultation_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chief_complaint TEXT,
  subjective_notes TEXT,
  objective_notes TEXT,
  assessment TEXT,
  plan TEXT,
  prescriptions JSONB,
  follow_up_date DATE,
  follow_up_notes TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_notes_appointment ON consultation_notes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_patient ON consultation_notes(patient_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practitioners_updated_at BEFORE UPDATE ON practitioners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultation_notes_updated_at BEFORE UPDATE ON consultation_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update practitioner rating when a review is added
CREATE OR REPLACE FUNCTION update_practitioner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE practitioners
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE practitioner_id = NEW.practitioner_id AND is_visible = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE practitioner_id = NEW.practitioner_id AND is_visible = TRUE
    )
  WHERE id = NEW.practitioner_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_practitioner_rating();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at, updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_on_message AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;

-- Public read access for services and specialties
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Specialties are viewable by everyone" ON specialties FOR SELECT USING (true);

-- Users can view their own profile and practitioners can be viewed publicly
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Practitioners policies
CREATE POLICY "Practitioners are viewable by everyone" ON practitioners FOR SELECT USING (true);
CREATE POLICY "Practitioners can update own profile" ON practitioners FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Practitioner services and specialties viewable by everyone
CREATE POLICY "Practitioner services viewable by everyone" ON practitioner_services FOR SELECT USING (true);
CREATE POLICY "Practitioner specialties viewable by everyone" ON practitioner_specialties FOR SELECT USING (true);

-- Availability viewable by everyone
CREATE POLICY "Availability viewable by everyone" ON availability FOR SELECT USING (true);
CREATE POLICY "Practitioners can manage own availability" ON availability FOR ALL USING (
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = availability.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (
  patient_id::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = appointments.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (patient_id::text = auth.uid()::text);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (
  patient_id::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = appointments.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  patient_id::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = conversations.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (patient_id::text = auth.uid()::text);

-- Messages policies  
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.patient_id::text = auth.uid()::text OR 
         EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = conversations.practitioner_id AND practitioners.user_id::text = auth.uid()::text))
  )
);
CREATE POLICY "Users can send messages in own conversations" ON messages FOR INSERT WITH CHECK (
  sender_id::text = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.patient_id::text = auth.uid()::text OR 
         EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = conversations.practitioner_id AND practitioners.user_id::text = auth.uid()::text))
  )
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Patients can create reviews" ON reviews FOR INSERT WITH CHECK (patient_id::text = auth.uid()::text);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (
  patient_id::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = reviews.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Health records policies
CREATE POLICY "Patients can view own health records" ON health_records FOR SELECT USING (patient_id::text = auth.uid()::text);
CREATE POLICY "Patients can manage own health records" ON health_records FOR ALL USING (patient_id::text = auth.uid()::text);

-- Video rooms policies
CREATE POLICY "Users can view own video rooms" ON video_rooms FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM appointments 
    WHERE appointments.id = video_rooms.appointment_id 
    AND (appointments.patient_id::text = auth.uid()::text OR 
         EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = appointments.practitioner_id AND practitioners.user_id::text = auth.uid()::text))
  )
);

-- Patient practitioners (favorites)
CREATE POLICY "Patients can view own practitioner list" ON patient_practitioners FOR SELECT USING (patient_id::text = auth.uid()::text);
CREATE POLICY "Patients can manage own practitioner list" ON patient_practitioners FOR ALL USING (patient_id::text = auth.uid()::text);

-- Consultation notes policies
CREATE POLICY "Users can view own consultation notes" ON consultation_notes FOR SELECT USING (
  patient_id::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = consultation_notes.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);
CREATE POLICY "Practitioners can create consultation notes" ON consultation_notes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = consultation_notes.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);
CREATE POLICY "Practitioners can update own consultation notes" ON consultation_notes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM practitioners WHERE practitioners.id = consultation_notes.practitioner_id AND practitioners.user_id::text = auth.uid()::text)
);

-- =====================================================
-- VIEWS FOR EASIER QUERYING
-- =====================================================

-- View for practitioner with user info
CREATE OR REPLACE VIEW practitioner_profiles AS
SELECT 
  p.*,
  u.email,
  u.full_name,
  u.phone_number,
  u.avatar_url,
  u.state as user_state
FROM practitioners p
JOIN users u ON p.user_id = u.id;

-- View for appointments with all related info
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
  a.*,
  pat.full_name as patient_name,
  pat.email as patient_email,
  pat.phone_number as patient_phone,
  prac.full_name as practitioner_name,
  prac.email as practitioner_email,
  pr.id as practitioner_record_id,
  pr.education,
  pr.is_verified,
  s.name as service_name,
  s.category as service_category,
  s.duration_minutes as service_duration
FROM appointments a
JOIN users pat ON a.patient_id = pat.id
JOIN practitioners pr ON a.practitioner_id = pr.id
JOIN users prac ON pr.user_id = prac.id
LEFT JOIN services s ON a.service_id = s.id;

-- =====================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =====================================================

-- Note: In production, users should be created through Supabase Auth
-- This is just for testing the schema

-- To test, uncomment and run this section after setting up auth:
/*
-- Sample Patient User
INSERT INTO users (id, email, full_name, user_type, state, phone_number) VALUES
  ('00000000-0000-0000-0000-000000000001', 'patient@example.com', 'John Patient', 'patient', 'California', '+1234567890');

-- Sample Practitioner User
INSERT INTO users (id, email, full_name, user_type, state, phone_number) VALUES
  ('00000000-0000-0000-0000-000000000002', 'doctor@example.com', 'Dr. Sarah Johnson', 'practitioner', 'California', '+1987654321');

-- Sample Practitioner Record
INSERT INTO practitioners (id, user_id, license_number, license_state, bio, years_of_experience, education, is_verified, rating, total_reviews, languages) VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'MD12345', 'California', 
   'Board-certified Internal Medicine physician with 15 years of experience in primary care and preventive medicine.', 
   15, 'Internal Medicine', true, 4.90, 127, ARRAY['English', 'Spanish']);

-- Link practitioner to services
INSERT INTO practitioner_services (practitioner_id, service_id, custom_price) 
SELECT '00000000-0000-0000-0000-000000000003', id, base_price FROM services WHERE name IN ('General Consultation', 'Follow-up Visit', 'Wellness Checkup');

-- Link practitioner to specialties
INSERT INTO practitioner_specialties (practitioner_id, specialty_id, is_primary)
SELECT '00000000-0000-0000-0000-000000000003', id, name = 'Internal Medicine' FROM specialties WHERE name IN ('Internal Medicine', 'Family Medicine');

-- Sample availability
INSERT INTO availability (practitioner_id, day_of_week, start_time, end_time, is_available) VALUES
  ('00000000-0000-0000-0000-000000000003', 1, '09:00', '17:00', true), -- Monday
  ('00000000-0000-0000-0000-000000000003', 2, '09:00', '17:00', true), -- Tuesday
  ('00000000-0000-0000-0000-000000000003', 3, '09:00', '17:00', true), -- Wednesday
  ('00000000-0000-0000-0000-000000000003', 4, '09:00', '17:00', true), -- Thursday
  ('00000000-0000-0000-0000-000000000003', 5, '09:00', '13:00', true); -- Friday
*/

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to anonymous users (for public data)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON services TO anon;
GRANT SELECT ON specialties TO anon;
GRANT SELECT ON practitioners TO anon;
GRANT SELECT ON practitioner_services TO anon;
GRANT SELECT ON practitioner_specialties TO anon;
GRANT SELECT ON availability TO anon;
GRANT SELECT ON reviews TO anon;

-- Done!
-- Run this schema in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kroauhjawrfgfqckfpmd/sql/new
