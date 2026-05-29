// Types générés depuis le schéma Supabase (supabase gen types / MCP).
// NE PAS éditer à la main — régénérer après toute migration.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          category: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          published_date: string | null
          status: string
          title: string
          updated_at: string
          video_url: string | null
          views: number
        }
        Insert: {
          author: string
          category: string
          created_at?: string
          excerpt: string
          featured?: boolean
          id?: string
          published_date?: string | null
          status?: string
          title: string
          updated_at?: string
          video_url?: string | null
          views?: number
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          published_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          views?: number
        }
        Relationships: []
      }
      certificates: {
        Row: {
          address: string
          certificate_number: string
          client_id: string
          company_name: string
          composite_rating: string
          created_at: string
          evaluation_date: string
          expert_name: string
          id: string
          pdf_storage_path: string | null
          siren: string
          status: string
          sub_criteria: Json
          validity_date: string
          vigi_score: string
          vigi_score_tendance: string
        }
        Insert: {
          address: string
          certificate_number: string
          client_id: string
          company_name: string
          composite_rating: string
          created_at?: string
          evaluation_date: string
          expert_name: string
          id?: string
          pdf_storage_path?: string | null
          siren: string
          status?: string
          sub_criteria: Json
          validity_date: string
          vigi_score: string
          vigi_score_tendance?: string
        }
        Update: {
          address?: string
          certificate_number?: string
          client_id?: string
          company_name?: string
          composite_rating?: string
          created_at?: string
          evaluation_date?: string
          expert_name?: string
          id?: string
          pdf_storage_path?: string | null
          siren?: string
          status?: string
          sub_criteria?: Json
          validity_date?: string
          vigi_score?: string
          vigi_score_tendance?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_primary: boolean
          last_name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_primary?: boolean
          last_name: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_primary?: boolean
          last_name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          access_type: string | null
          assigned_client_ids: string[]
          category: string
          created_at: string
          description: string
          duration: string | null
          file_size: string | null
          id: string
          title: string
          type: string
          updated_at: string
          upload_date: string
          url: string | null
          visibility: string
          youtube_id: string | null
        }
        Insert: {
          access_type?: string | null
          assigned_client_ids?: string[]
          category: string
          created_at?: string
          description?: string
          duration?: string | null
          file_size?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string
          upload_date?: string
          url?: string | null
          visibility?: string
          youtube_id?: string | null
        }
        Update: {
          access_type?: string | null
          assigned_client_ids?: string[]
          category?: string
          created_at?: string
          description?: string
          duration?: string | null
          file_size?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string
          upload_date?: string
          url?: string | null
          visibility?: string
          youtube_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address_city: string
          address_country: string
          address_postal_code: string
          address_street: string
          company_name: string
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          headcount: string | null
          id: string
          internal_notes: string
          legal_form: string
          sector: string
          siret: string
          slug: string
          status: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address_city: string
          address_country?: string
          address_postal_code: string
          address_street: string
          company_name: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          headcount?: string | null
          id?: string
          internal_notes?: string
          legal_form: string
          sector: string
          siret: string
          slug: string
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address_city?: string
          address_country?: string
          address_postal_code?: string
          address_street?: string
          company_name?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          headcount?: string | null
          id?: string
          internal_notes?: string
          legal_form?: string
          sector?: string
          siret?: string
          slug?: string
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      contract_documents: {
        Row: {
          client_id: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          notes: string | null
          status: string
          storage_path: string | null
          title: string
          type: string
          uploaded_at: string
          uploaded_by: string | null
          version: number
        }
        Insert: {
          client_id: string
          file_name: string
          file_size?: number
          id?: string
          mime_type?: string
          notes?: string | null
          status?: string
          storage_path?: string | null
          title: string
          type: string
          uploaded_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          client_id?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          notes?: string | null
          status?: string
          storage_path?: string | null
          title?: string
          type?: string
          uploaded_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          auditor_id: string
          certificate_id: string | null
          client_id: string
          composite_rating: string | null
          created_at: string
          id: string
          next_evaluation_due: string | null
          notes: string | null
          omt_score: Json | null
          report_document_id: string | null
          site_address: string
          site_name: string
          status: string
          updated_at: string
          vigi_score: string | null
          visit_date: string
        }
        Insert: {
          auditor_id: string
          certificate_id?: string | null
          client_id: string
          composite_rating?: string | null
          created_at?: string
          id?: string
          next_evaluation_due?: string | null
          notes?: string | null
          omt_score?: Json | null
          report_document_id?: string | null
          site_address: string
          site_name: string
          status?: string
          updated_at?: string
          vigi_score?: string | null
          visit_date: string
        }
        Update: {
          auditor_id?: string
          certificate_id?: string | null
          client_id?: string
          composite_rating?: string | null
          created_at?: string
          id?: string
          next_evaluation_due?: string | null
          notes?: string | null
          omt_score?: Json | null
          report_document_id?: string | null
          site_address?: string
          site_name?: string
          status?: string
          updated_at?: string
          vigi_score?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_auditor_id_fkey"
            columns: ["auditor_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "v_certificate_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_report_document_id_fkey"
            columns: ["report_document_id"]
            isOneToOne: false
            referencedRelation: "contract_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      founders: {
        Row: {
          bio: Json
          created_at: string
          current_entity: Json | null
          former_org: Json | null
          id: string
          image_position: string | null
          image_url: string
          name: string
          role: Json
          specialties: Json
          updated_at: string
          visible: boolean
        }
        Insert: {
          bio: Json
          created_at?: string
          current_entity?: Json | null
          former_org?: Json | null
          id?: string
          image_position?: string | null
          image_url?: string
          name: string
          role: Json
          specialties?: Json
          updated_at?: string
          visible?: boolean
        }
        Update: {
          bio?: Json
          created_at?: string
          current_entity?: Json | null
          former_org?: Json | null
          id?: string
          image_position?: string | null
          image_url?: string
          name?: string
          role?: Json
          specialties?: Json
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          assigned_client_ids: string[]
          created_at: string
          date: string
          id: string
          message: string
          type: string
          visibility: string
        }
        Insert: {
          assigned_client_ids?: string[]
          created_at?: string
          date?: string
          id?: string
          message: string
          type: string
          visibility?: string
        }
        Update: {
          assigned_client_ids?: string[]
          created_at?: string
          date?: string
          id?: string
          message?: string
          type?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          client_id: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          company?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          access_type: string
          assigned_client_ids: string[]
          category: string
          created_at: string
          description: string
          file_size: string | null
          id: string
          published_date: string | null
          source: string | null
          title: string
          type: string
          updated_at: string
          url: string
          visibility: string
          youtube_id: string | null
        }
        Insert: {
          access_type: string
          assigned_client_ids?: string[]
          category: string
          created_at?: string
          description: string
          file_size?: string | null
          id?: string
          published_date?: string | null
          source?: string | null
          title: string
          type: string
          updated_at?: string
          url: string
          visibility?: string
          youtube_id?: string | null
        }
        Update: {
          access_type?: string
          assigned_client_ids?: string[]
          category?: string
          created_at?: string
          description?: string
          file_size?: string | null
          id?: string
          published_date?: string | null
          source?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string
          visibility?: string
          youtube_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string
          business_hours: Json
          city: string
          company: Json
          country: string
          email: string
          id: number
          map_latitude: number | null
          map_longitude: number | null
          phone: string
          updated_at: string
          website: string
        }
        Insert: {
          address: string
          business_hours: Json
          city: string
          company: Json
          country: string
          email: string
          id?: number
          map_latitude?: number | null
          map_longitude?: number | null
          phone: string
          updated_at?: string
          website: string
        }
        Update: {
          address?: string
          business_hours?: Json
          city?: string
          company?: Json
          country?: string
          email?: string
          id?: number
          map_latitude?: number | null
          map_longitude?: number | null
          phone?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_admin_dashboard_stats: {
        Row: {
          active_clients: number | null
          published_articles: number | null
          published_documents: number | null
        }
        Relationships: []
      }
      v_certificate_public: {
        Row: {
          address: string | null
          certificate_number: string | null
          company_name: string | null
          composite_rating: string | null
          evaluation_date: string | null
          expert_name: string | null
          id: string | null
          siren: string | null
          status: string | null
          sub_criteria: Json | null
          validity_date: string | null
          vigi_score: string | null
          vigi_score_tendance: string | null
        }
        Relationships: []
      }
      v_client_evaluation_counts: {
        Row: {
          client_id: string | null
          n: number | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      v_vigi_distribution: {
        Row: {
          n: number | null
          vigi_score: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_client_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      slugify: { Args: { v: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R }
  ? R
  : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never
