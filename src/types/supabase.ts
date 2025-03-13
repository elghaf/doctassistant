export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_summaries: {
        Row: {
          created_at: string | null
          id: string
          model_type: string | null
          patient_id: string
          summary: string
          summary_type: string | null
          treatment_recommendations: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_type?: string | null
          patient_id: string
          summary: string
          summary_type?: string | null
          treatment_recommendations?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_type?: string | null
          patient_id?: string
          summary?: string
          summary_type?: string | null
          treatment_recommendations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_summaries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          date: string
          duration: number
          id: string
          notes: string | null
          patient_id: string
          pre_visit_include_details: boolean | null
          pre_visit_notification_time: number | null
          send_pre_visit_notification: boolean | null
          status: string
          time: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          duration: number
          id?: string
          notes?: string | null
          patient_id: string
          pre_visit_include_details?: boolean | null
          pre_visit_notification_time?: number | null
          send_pre_visit_notification?: boolean | null
          status?: string
          time: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          notes?: string | null
          patient_id?: string
          pre_visit_include_details?: boolean | null
          pre_visit_notification_time?: number | null
          send_pre_visit_notification?: boolean | null
          status?: string
          time?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          allergies: Json | null
          conditions: Json | null
          created_at: string | null
          family_history: Json | null
          id: string
          lifestyle: Json | null
          patient_id: string
          surgeries: Json | null
          updated_at: string | null
        }
        Insert: {
          allergies?: Json | null
          conditions?: Json | null
          created_at?: string | null
          family_history?: Json | null
          id?: string
          lifestyle?: Json | null
          patient_id: string
          surgeries?: Json | null
          updated_at?: string | null
        }
        Update: {
          allergies?: Json | null
          conditions?: Json | null
          created_at?: string | null
          family_history?: Json | null
          id?: string
          lifestyle?: Json | null
          patient_id?: string
          surgeries?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_summaries: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          patient_id: string
          status: string | null
          summary: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id: string
          status?: string | null
          summary: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id?: string
          status?: string | null
          summary?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_summaries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          blood_type: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string
          id: string
          insurance_number: string | null
          insurance_provider: string | null
          last_name: string
          notes: string | null
          phone: string
          state: string | null
          status: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender: string
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name: string
          notes?: string | null
          phone: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          notes?: string | null
          phone?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          thumbnail: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: string
          created_at: string | null
          id: string
          patient_id: string
          status: string | null
          template_id: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          patient_id: string
          status?: string | null
          template_id?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          patient_id?: string
          status?: string | null
          template_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      symptoms: {
        Row: {
          duration: string | null
          id: string
          name: string
          notes: string | null
          patient_id: string
          recorded_at: string | null
          severity: number
        }
        Insert: {
          duration?: string | null
          id?: string
          name: string
          notes?: string | null
          patient_id: string
          recorded_at?: string | null
          severity: number
        }
        Update: {
          duration?: string | null
          id?: string
          name?: string
          notes?: string | null
          patient_id?: string
          recorded_at?: string | null
          severity?: number
        }
        Relationships: [
          {
            foreignKeyName: "symptoms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          appointment_id: string | null
          chief_complaint: string | null
          created_at: string | null
          diagnosis: string | null
          id: string
          notes: string | null
          patient_id: string
          treatment_plan: string | null
          updated_at: string | null
          visit_date: string
        }
        Insert: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          treatment_plan?: string | null
          updated_at?: string | null
          visit_date: string
        }
        Update: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          treatment_plan?: string | null
          updated_at?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
