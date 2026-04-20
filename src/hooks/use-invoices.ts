import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Invoice } from '@/types'

export function useInvoices(orgId: string | undefined) {
  return useQuery({
    queryKey: ['invoices', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(*)')
        .eq('org_id', orgId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Invoice[]
    },
    enabled: !!orgId,
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Invoice
    },
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, 'id' | 'created_at' | 'client'>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select()
        .single()
      if (error) throw error
      return data as Invoice
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['invoices', v.org_id] }),
  })
}

export function useUpdateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<Invoice> & { id: string; org_id: string }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(fields)
        .eq('id', id)
        .select('*, client:clients(*)')
        .single()
      if (error) throw error
      return data as Invoice
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['invoices', v.org_id] })
      qc.invalidateQueries({ queryKey: ['invoice', v.id] })
    },
  })
}

export function useDeleteInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id)
      if (error) throw error
      return orgId
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['invoices', v.orgId] }),
  })
}

export function calcInvoiceTotals(invoice: Pick<Invoice, 'items' | 'tax_rate'>) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  )
  const tax = subtotal * (invoice.tax_rate / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}
