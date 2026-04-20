import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/types'

export function useClients(orgId: string | undefined) {
  return useQuery({
    queryKey: ['clients', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('org_id', orgId!)
        .order('name')
      if (error) throw error
      return data as Client[]
    },
    enabled: !!orgId,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['clients', v.org_id] }),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<Client> & { id: string; org_id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(fields)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['clients', v.org_id] }),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      return orgId
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['clients', v.orgId] }),
  })
}
