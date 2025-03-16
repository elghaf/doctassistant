-- Modified connection termination (avoids superuser issue)
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
JOIN pg_user ON pg_user.usename = pg_stat_activity.usename
WHERE pg_stat_activity.datname = current_database()
  AND pg_stat_activity.pid <> pg_backend_pid()
  AND NOT pg_user.usesuper;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointment_slots CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS medical_reports CASCADE;
DROP TABLE IF EXISTS patient_questionnaires CASCADE;
DROP TABLE IF EXISTS questionnaires CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (main user table)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaires table
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_questionnaires table
CREATE TABLE patient_questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id),
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_reports table
CREATE TABLE medical_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  summary TEXT,
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'normal',
  report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending',
  appointment_type TEXT,
  time_slot TEXT,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment_slots table
CREATE TABLE appointment_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'questionnaire', 'report', 'message', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Update profiles policies with proper type casting and permissions
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid()::text = id::text);

-- Allow authenticated users to insert profiles
CREATE POLICY "Allow insert for authenticated users" ON profiles 
FOR INSERT WITH CHECK (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Create policies for patients table
DROP POLICY IF EXISTS "Users can view their own patient record" ON patients;
DROP POLICY IF EXISTS "Users can update their own patient record" ON patients;

CREATE POLICY "Users can view their own patient record"
  ON patients FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own patient record"
  ON patients FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Create policies for doctors table
DROP POLICY IF EXISTS "Users can view their own doctor record" ON doctors;
DROP POLICY IF EXISTS "Users can update their own doctor record" ON doctors;

CREATE POLICY "Users can view their own doctor record"
  ON doctors FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own doctor record"
  ON doctors FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Create policies for appointments
CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can view appointments assigned to them"
  ON appointments FOR SELECT
  USING (auth.uid()::text = doctor_id::text);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can update appointments assigned to them"
  ON appointments FOR UPDATE
  USING (auth.uid()::text = doctor_id::text);

CREATE POLICY "Patients can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid()::text = patient_id::text);

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::text = user_id::text);


-- Create profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
  user_name TEXT := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, user_name, default_role);
  
  -- Insert into role-specific table
  IF default_role = 'patient' THEN
    INSERT INTO public.patients (user_id, name, email, role)
    VALUES (NEW.id, user_name, NEW.email, default_role);
  ELSIF default_role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, name, email, role)
    VALUES (NEW.id, user_name, NEW.email, default_role);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Corriger les politiques RLS pour la table profiles
DROP POLICY IF EXISTS "Profiles insert policy" ON profiles;
CREATE POLICY "Admin full access" ON profiles 
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (true);

CREATE POLICY "Notifications access" ON notifications 
FOR ALL USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add policy to allow checking for existing profiles
CREATE POLICY "Allow email existence check"
ON profiles FOR SELECT
USING (true);

-- Update the insert policy to be more permissive during signup
CREATE POLICY "Allow profile creation during signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid()::text = id::text OR auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Ensure proper permissions for the auth trigger
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE questionnaires;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_questionnaires;
ALTER PUBLICATION supabase_realtime ADD TABLE medical_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE appointment_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Add the missing create_user_profile function
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT
) RETURNS void AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO profiles (id, email, name, role)
  VALUES (user_id, user_email, user_name, user_role);
  
  -- Insert into role-specific table
  IF user_role = 'patient' THEN
    INSERT INTO patients (user_id, name, email, role)
    VALUES (user_id, user_name, user_email, user_role);
  ELSIF user_role = 'doctor' THEN
    INSERT INTO doctors (user_id, name, email, role)
    VALUES (user_id, user_name, user_email, user_role);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
