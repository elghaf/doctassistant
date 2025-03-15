-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors can view appointments assigned to them" ON appointments;
CREATE POLICY "Doctors can view appointments assigned to them"
  ON appointments FOR SELECT
  USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;
CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors can update appointments assigned to them" ON appointments;
CREATE POLICY "Doctors can update appointments assigned to them"
  ON appointments FOR UPDATE
  USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Patients can update their own appointments" ON appointments;
CREATE POLICY "Patients can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id);

-- Enable realtime
-- Note: Table is already part of the publication, so we don't need to add it again
