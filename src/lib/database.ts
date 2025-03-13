import { supabase } from './supabase';

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  duration: number;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
}

export const database = {
  patients: {
    async getPatient(userId: string) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },

    async updatePatient(patientId: string, updates: Partial<Patient>) {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId)
        .single();

      if (error) throw error;
      return data;
    },

    async createOrUpdate(patientData: { user_id: string; name: string; email: string }) {
      // First try to get existing patient
      const { data: existing } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', patientData.user_id)
        .single();

      if (existing) {
        // Update existing patient
        const { data, error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', existing.id)
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new patient
        const { data, error } = await supabase
          .from('patients')
          .insert(patientData)
          .single();

        if (error) throw error;
        return data;
      }
    },
  },

  appointments: {
    async getUpcoming(patientId: string) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },

    async create(appointment: Omit<Appointment, 'id'>) {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .single();

      if (error) throw error;
      return data;
    }
  },

  questionnaires: {
    async getPending(patientId: string) {
      const { data, error } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    },

    async submit(questionnaireId: string, responses: any) {
      const { data, error } = await supabase
        .from('questionnaires')
        .update({
          status: 'completed',
          responses,
          updated_at: new Date().toISOString()
        })
        .eq('id', questionnaireId)
        .single();

      if (error) throw error;
      return data;
    }
  },

  reports: {
    async getAll(patientId: string) {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async create(report: any) {
      const { data, error } = await supabase
        .from('medical_reports')
        .insert(report)
        .single();

      if (error) throw error;
      return data;
    }
  },

  notifications: {
    async getUnread(userId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async markAsRead(notificationId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .single();

      if (error) throw error;
      return data;
    }
  }
};