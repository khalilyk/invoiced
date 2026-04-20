export type BrandSettings = {
  primary_color: string
  secondary_color: string
  accent_color: string
  font_family: string
  font_size_base: number
  heading_size: number
  logo_url: string | null
  address: string | null
  email: string | null
  phone: string | null
  website: string | null
  footer_note: string | null
}

export const DEFAULT_BRAND: BrandSettings = {
  primary_color: '#111111',
  secondary_color: '#f5f5f5',
  accent_color: '#6366f1',
  font_family: 'Inter',
  font_size_base: 14,
  heading_size: 24,
  logo_url: null,
  address: null,
  email: null,
  phone: null,
  website: null,
  footer_note: null,
}

export type Organization = {
  id: string
  name: string
  owner_id: string
  brand: BrandSettings
  created_at: string
}

export type Client = {
  id: string
  org_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  company: string | null
  created_at: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export type InvoiceItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
}

export type Invoice = {
  id: string
  org_id: string
  client_id: string
  client?: Client
  number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  notes: string | null
  items: InvoiceItem[]
  tax_rate: number
  created_at: string
}

export const FONT_OPTIONS = [
  'Inter',
  'Playfair Display',
  'Roboto',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Source Sans 3',
  'DM Sans',
  'Space Grotesk',
] as const

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
}

export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
}
