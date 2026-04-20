// Mirrors supabase/schema.sql
// Regenerate with: npx supabase gen types typescript --project-id [ID] > src/types/database.ts

import type { BrandSettings, InvoiceItem, InvoiceStatus } from '@/types'

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          owner_id: string
          name: string
          brand: BrandSettings
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          brand?: BrandSettings
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          brand?: BrandSettings
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          org_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          org_id: string
          client_id: string
          number: string
          status: InvoiceStatus
          issue_date: string
          due_date: string
          tax_rate: number
          notes: string | null
          items: InvoiceItem[]
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          client_id: string
          number: string
          status?: InvoiceStatus
          issue_date: string
          due_date: string
          tax_rate?: number
          notes?: string | null
          items?: InvoiceItem[]
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          client_id?: string
          number?: string
          status?: InvoiceStatus
          issue_date?: string
          due_date?: string
          tax_rate?: number
          notes?: string | null
          items?: InvoiceItem[]
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
