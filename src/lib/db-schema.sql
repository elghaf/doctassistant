-- Supabase SQL Schema for Doctor's Assistant App

-- Patients Table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  blood_type TEXT,
  status TEXT DEFAULT 'active'
);

-- Medical History Table
CREATE TABLE medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  conditions JSONB,
  allergies JSONB,
  surgeries JSONB,
  family_history JSONB,
  lifestyle JSONB
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  send_pre_visit_notification BOOLEAN DEFAULT FALSE,
  pre_visit_notification_time INTEGER,
  pre_visit_include_details BOOLEAN DEFAULT FALSE
);

-- Visits Table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  chief_complaint TEXT NOT NULL,
  symptoms JSONB,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  follow_up DATE
);

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id TEXT,
  status TEXT DEFAULT 'draft',
  type TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_medical_history_patient_id ON medical_history(patient_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_reports_patient_id ON reports(patient_id);
