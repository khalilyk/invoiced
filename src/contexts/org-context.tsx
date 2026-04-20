import { createContext, useContext, useMemo, useState } from 'react'
import type { Organization } from '@/types'

type OrgContextValue = {
  orgs: Organization[]
  activeOrg: Organization | null
  setActiveOrg: (org: Organization) => void
  setOrgs: (orgs: Organization[]) => void
}

const OrgContext = createContext<OrgContextValue | null>(null)

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [activeOrgId, setActiveOrgId] = useState<string | null>(
    () => localStorage.getItem('active_org_id')
  )

  const activeOrg = useMemo(
    () => orgs.find(o => o.id === activeOrgId) ?? orgs[0] ?? null,
    [orgs, activeOrgId]
  )

  function setActiveOrg(org: Organization) {
    setActiveOrgId(org.id)
    localStorage.setItem('active_org_id', org.id)
  }

  return (
    <OrgContext.Provider value={{ orgs, activeOrg, setActiveOrg, setOrgs }}>
      {children}
    </OrgContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrgContext() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrgContext must be used inside OrgProvider')
  return ctx
}
