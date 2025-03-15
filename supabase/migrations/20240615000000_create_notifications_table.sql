-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'questionnaire', 'report', 'message', 'system')),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action_url TEXT,
  metadata JSONB
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

-- Create index on status for faster filtering of unread notifications
CREATE INDEX IF NOT EXISTS notifications_status_idx ON notifications(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Enable row level security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their notifications
DROP POLICY IF EXISTS "Users can view their own notifications";
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update only their notifications
DROP POLICY IF EXISTS "Users can update their own notifications";
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime subscriptions for this table
alter publication supabase_realtime add table notifications;
