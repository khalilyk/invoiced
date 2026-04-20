import { useEffect } from 'react'
import { useOrgs } from '@/hooks/use-orgs'
import { useOrgContext } from '@/contexts/org-context'

export function OrgLoader({ children }: { children: React.ReactNode }) {
  const { data: orgs = [] } = useOrgs()
  const { setOrgs } = useOrgContext()

  useEffect(() => {
    setOrgs(orgs)
  }, [orgs, setOrgs])

  return <>{children}</>
}
