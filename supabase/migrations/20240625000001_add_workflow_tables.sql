-- Create workflow status table
CREATE TABLE IF NOT EXISTS workflow_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow transitions table
CREATE TABLE IF NOT EXISTS workflow_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_status_id UUID REFERENCES workflow_status(id),
  to_status_id UUID REFERENCES workflow_status(id),
  name TEXT NOT NULL,
  requires_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient workflow table
CREATE TABLE IF NOT EXISTS patient_workflow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  current_status_id UUID REFERENCES workflow_status(id) NOT NULL,
  previous_status_id UUID REFERENCES workflow_status(id),
  assigned_to TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow history table
CREATE TABLE IF NOT EXISTS workflow_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  from_status_id UUID REFERENCES workflow_status(id),
  to_status_id UUID REFERENCES workflow_status(id) NOT NULL,
  transition_id UUID REFERENCES workflow_transitions(id),
  performed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow tasks table
CREATE TABLE IF NOT EXISTS workflow_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  status_id UUID REFERENCES workflow_status(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default workflow statuses
INSERT INTO workflow_status (name, description, color) VALUES
('New', 'Patient has been registered but not yet processed', '#3b82f6'),
('Intake', 'Patient information is being collected', '#8b5cf6'),
('Assessment', 'Medical assessment in progress', '#f59e0b'),
('Treatment', 'Patient is undergoing treatment', '#10b981'),
('Follow-up', 'Patient requires follow-up care', '#6366f1'),
('Discharged', 'Patient has been discharged', '#64748b');

-- Insert default workflow transitions
INSERT INTO workflow_transitions (from_status_id, to_status_id, name, requires_approval)
SELECT 
  s1.id, 
  s2.id, 
  s1.name || ' to ' || s2.name,
  FALSE
FROM workflow_status s1, workflow_status s2
WHERE s1.name != s2.name;

-- Enable row level security
ALTER TABLE workflow_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow read access to workflow_status";
CREATE POLICY "Allow read access to workflow_status"
  ON workflow_status FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow read access to workflow_transitions";
CREATE POLICY "Allow read access to workflow_transitions"
  ON workflow_transitions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow read access to patient_workflow";
CREATE POLICY "Allow read access to patient_workflow"
  ON patient_workflow FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert to patient_workflow";
CREATE POLICY "Allow insert to patient_workflow"
  ON patient_workflow FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update to patient_workflow";
CREATE POLICY "Allow update to patient_workflow"
  ON patient_workflow FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow read access to workflow_history";
CREATE POLICY "Allow read access to workflow_history"
  ON workflow_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert to workflow_history";
CREATE POLICY "Allow insert to workflow_history"
  ON workflow_history FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read access to workflow_tasks";
CREATE POLICY "Allow read access to workflow_tasks"
  ON workflow_tasks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert to workflow_tasks";
CREATE POLICY "Allow insert to workflow_tasks"
  ON workflow_tasks FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update to workflow_tasks";
CREATE POLICY "Allow update to workflow_tasks"
  ON workflow_tasks FOR UPDATE
  USING (true);

-- Add realtime publication
alter publication supabase_realtime add table workflow_status;
alter publication supabase_realtime add table workflow_transitions;
alter publication supabase_realtime add table patient_workflow;
alter publication supabase_realtime add table workflow_history;
alter publication supabase_realtime add table workflow_tasks;

-- Add appointment status field
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS workflow_status_id UUID REFERENCES workflow_status(id);

-- Add visit status field
ALTER TABLE visits ADD COLUMN IF NOT EXISTS workflow_status_id UUID REFERENCES workflow_status(id);
