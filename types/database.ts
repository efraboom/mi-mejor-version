export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: { id: string; user_id: string; nombre: string | null; created_at: string }
        Insert: { id?: string; user_id: string; nombre?: string | null; created_at?: string }
        Update: { nombre?: string | null }
        Relationships: []
      }
      tracker_entries: {
        Row: { id: string; user_id: string; habit_index: number; day_index: number; week_start: string; completed: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; habit_index: number; day_index: number; week_start: string; completed?: boolean; created_at?: string; updated_at?: string }
        Update: { completed?: boolean; updated_at?: string }
        Relationships: []
      }
      journal_entries: {
        Row: { id: string; user_id: string; fecha: string; texto: string | null; emocion: string | null; prompt_usado: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; fecha?: string; texto?: string | null; emocion?: string | null; prompt_usado?: string | null; updated_at?: string }
        Update: { texto?: string | null; emocion?: string | null; prompt_usado?: string | null; updated_at?: string }
        Relationships: []
      }
      progress_scores: {
        Row: { id: string; user_id: string; area_id: string; valor: number; updated_at: string }
        Insert: { id?: string; user_id: string; area_id: string; valor?: number; updated_at?: string }
        Update: { valor?: number; updated_at?: string }
        Relationships: []
      }
      diagnostico_responses: {
        Row: { id: string; user_id: string; pregunta_key: string; respuesta: string | null; updated_at: string }
        Insert: { id?: string; user_id: string; pregunta_key: string; respuesta?: string | null; updated_at?: string }
        Update: { respuesta?: string | null; updated_at?: string }
        Relationships: []
      }
      meta_progreso: {
        Row: { id: string; user_id: string; meta_id: string; semana: number; habito_index: number; fecha_completado: string; created_at: string }
        Insert: { id?: string; user_id: string; meta_id: string; semana: number; habito_index: number; fecha_completado?: string; created_at?: string }
        Update: { fecha_completado?: string }
        Relationships: []
      }
      metas: {
        Row: { id: string; user_id: string; titulo: string; plazo: string; fecha_limite: string | null; pasos: Json; activa: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; titulo: string; plazo: string; fecha_limite?: string | null; pasos?: Json; activa?: boolean; created_at?: string; updated_at?: string }
        Update: { titulo?: string; plazo?: string; fecha_limite?: string | null; pasos?: Json; activa?: boolean; updated_at?: string }
        Relationships: []
      }
      checklist_daily: {
        Row: { id: string; user_id: string; fecha: string; item_index: number; completed: boolean }
        Insert: { id?: string; user_id: string; fecha?: string; item_index: number; completed?: boolean }
        Update: { completed?: boolean }
        Relationships: []
      }
      weekly_reviews: {
        Row: { id: string; user_id: string; week_start: string; celebro: string | null; habitos_cumplidos: string | null; ajustes: string | null; intencion: string | null; resumen_ia: string | null; updated_at: string }
        Insert: { id?: string; user_id: string; week_start: string; celebro?: string | null; habitos_cumplidos?: string | null; ajustes?: string | null; intencion?: string | null; resumen_ia?: string | null; updated_at?: string }
        Update: { celebro?: string | null; habitos_cumplidos?: string | null; ajustes?: string | null; intencion?: string | null; resumen_ia?: string | null; updated_at?: string }
        Relationships: []
      }
      gratitud_entries: {
        Row: { id: string; user_id: string; fecha: string; item1: string | null; item2: string | null; item3: string | null; updated_at: string }
        Insert: { id?: string; user_id: string; fecha?: string; item1?: string | null; item2?: string | null; item3?: string | null; updated_at?: string }
        Update: { item1?: string | null; item2?: string | null; item3?: string | null; updated_at?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type TrackerEntry = Database['public']['Tables']['tracker_entries']['Row']
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type ProgressScore = Database['public']['Tables']['progress_scores']['Row']
export type DiagnosticoResponse = Database['public']['Tables']['diagnostico_responses']['Row']
export type ChecklistItem = Database['public']['Tables']['checklist_daily']['Row']
export type WeeklyReview = Database['public']['Tables']['weekly_reviews']['Row']
export type GratitudEntry = Database['public']['Tables']['gratitud_entries']['Row']
