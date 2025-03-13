-- Create patient_summaries table
CREATE TABLE IF NOT EXISTS patient_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  status TEXT DEFAULT 'active'
);

-- Enable realtime for patient_summaries
alter publication supabase_realtime add table patient_summaries;
