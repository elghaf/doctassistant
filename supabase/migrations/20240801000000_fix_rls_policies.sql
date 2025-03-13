-- Disable RLS for profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS for patients table
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Disable RLS for doctors table
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix any policies that might be using text = uuid comparison
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id::TEXT = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id::TEXT = auth.uid()::TEXT);
