-- Add questionnaires table
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER publication supabase_realtime add table questionnaires;

-- Add patient_questionnaires table for assignments
CREATE TABLE IF NOT EXISTS patient_questionnaires (
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
ALTER publication supabase_realtime add table patient_questionnaires;

-- Add medical_reports table
CREATE TABLE IF NOT EXISTS medical_reports (
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
ALTER publication supabase_realtime add table medical_reports;

-- Add appointment_slots table for available slots
CREATE TABLE IF NOT EXISTS appointment_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER publication supabase_realtime add table appointment_slots;

-- Update appointments table with additional fields if needed
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS appointment_type TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_slot TEXT;
