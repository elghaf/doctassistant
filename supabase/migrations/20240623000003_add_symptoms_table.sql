-- Create symptoms table if it doesn't exist already
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  name TEXT NOT NULL,
  severity INTEGER NOT NULL,
  duration TEXT,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for symptoms
alter publication supabase_realtime add table symptoms;
