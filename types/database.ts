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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          client_name: string | null
          description: string | null
          status: 'active' | 'completed' | 'paused'
          start_date: string | null
          end_date: string | null
          contract_amount: number | null
          ai_estimated_amount: number | null
          ai_estimated_days: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          client_name?: string | null
          description?: string | null
          status?: 'active' | 'completed' | 'paused'
          start_date?: string | null
          end_date?: string | null
          contract_amount?: number | null
          ai_estimated_amount?: number | null
          ai_estimated_days?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          client_name?: string | null
          description?: string | null
          status?: 'active' | 'completed' | 'paused'
          start_date?: string | null
          end_date?: string | null
          contract_amount?: number | null
          ai_estimated_amount?: number | null
          ai_estimated_days?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contract_features: {
        Row: {
          id: string
          project_id: string
          user_id: string
          feature_name: string
          detail_work: string | null
          estimated_days: number | null
          daily_rate: number | null
          amount: number | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          feature_name: string
          detail_work?: string | null
          estimated_days?: number | null
          daily_rate?: number | null
          amount?: number | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          feature_name?: string
          detail_work?: string | null
          estimated_days?: number | null
          daily_rate?: number | null
          amount?: number | null
          sort_order?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      requests: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string | null
          content: string | null
          requester_name: string | null
          status: 'pending' | 'in_scope' | 'out_of_scope' | 'needs_review' | 'judged'
          channel: 'kakao' | 'email' | 'phone' | 'meeting' | 'other' | null
          requested_at: string | null
          is_overridden: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title?: string | null
          content?: string | null
          requester_name?: string | null
          status?: 'pending' | 'in_scope' | 'out_of_scope' | 'needs_review' | 'judged'
          channel?: 'kakao' | 'email' | 'phone' | 'meeting' | 'other' | null
          requested_at?: string | null
          is_overridden?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string | null
          content?: string | null
          requester_name?: string | null
          status?: 'pending' | 'in_scope' | 'out_of_scope' | 'needs_review' | 'judged'
          channel?: 'kakao' | 'email' | 'phone' | 'meeting' | 'other' | null
          requested_at?: string | null
          is_overridden?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      scope_judgments: {
        Row: {
          id: string
          request_id: string
          user_id: string
          result: string | null
          reasoning: string | null
          confidence_score: number | null
          recommendation: string | null
          model_used: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          user_id: string
          result?: string | null
          reasoning?: string | null
          confidence_score?: number | null
          recommendation?: string | null
          model_used?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          user_id?: string
          result?: string | null
          reasoning?: string | null
          confidence_score?: number | null
          recommendation?: string | null
          model_used?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scope_judgments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scope_judgments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      onboarding_surveys: {
        Row: {
          id: string
          user_id: string
          agency_size: string | null
          has_given_up_billing: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agency_size?: string | null
          has_given_up_billing?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agency_size?: string | null
          has_given_up_billing?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_surveys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          project_id: string
          request_id: string
          user_id: string
          report_data: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          request_id: string
          user_id: string
          report_data: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          request_id?: string
          user_id?: string
          report_data?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_request_id_fkey"
            columns: ["request_id"]
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ContractFeature = Database['public']['Tables']['contract_features']['Row']
export type ContractFeatureInsert = Database['public']['Tables']['contract_features']['Insert']
export type ContractFeatureUpdate = Database['public']['Tables']['contract_features']['Update']

export type Request = Database['public']['Tables']['requests']['Row']
export type RequestInsert = Database['public']['Tables']['requests']['Insert']
export type RequestUpdate = Database['public']['Tables']['requests']['Update']

export type ScopeJudgment = Database['public']['Tables']['scope_judgments']['Row']
export type ScopeJudgmentInsert = Database['public']['Tables']['scope_judgments']['Insert']
export type ScopeJudgmentUpdate = Database['public']['Tables']['scope_judgments']['Update']

export type OnboardingSurvey = Database['public']['Tables']['onboarding_surveys']['Row']
export type OnboardingSurveyInsert = Database['public']['Tables']['onboarding_surveys']['Insert']
export type OnboardingSurveyUpdate = Database['public']['Tables']['onboarding_surveys']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Report = Database['public']['Tables']['reports']['Row']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']
