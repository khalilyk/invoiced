import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Organization, BrandSettings } from '@/types'
import { DEFAULT_BRAND } from '@/types'

export function useOrgs() {
  return useQuery({
    queryKey: ['orgs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as Organization[]
    },
  })
}

export function useCreateOrg() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('organizations')
        .insert({ name, owner_id: user.id, brand: DEFAULT_BRAND })
        .select()
        .single()
      if (error) throw error
      return data as Organization
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orgs'] }),
  })
}

export function useUpdateBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ orgId, brand }: { orgId: string; brand: BrandSettings }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update({ brand })
        .eq('id', orgId)
        .select()
        .single()
      if (error) throw error
      return data as Organization
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orgs'] }),
  })
}

export function useDeleteOrg() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (orgId: string) => {
      const { error } = await supabase.from('organizations').delete().eq('id', orgId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orgs'] }),
  })
}
