export interface Patient {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}