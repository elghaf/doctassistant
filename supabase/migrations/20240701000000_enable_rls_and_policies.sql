-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policies for patients table
DROP POLICY IF EXISTS "Users can view their own patient record" ON patients;
CREATE POLICY "Users can view their own patient record"
ON patients FOR SELECT
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own patient record" ON patients;
CREATE POLICY "Users can update their own patient record"
ON patients FOR UPDATE
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own patient record" ON patients;
CREATE POLICY "Users can insert their own patient record"
ON patients FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create policies for doctors table
DROP POLICY IF EXISTS "Users can view their own doctor record" ON doctors;
CREATE POLICY "Users can view their own doctor record"
ON doctors FOR SELECT
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own doctor record" ON doctors;
CREATE POLICY "Users can update their own doctor record"
ON doctors FOR UPDATE
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own doctor record" ON doctors;
CREATE POLICY "Users can insert their own doctor record"
ON doctors FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications table
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime for tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table doctors;
alter publication supabase_realtime add table notifications;