import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Palette, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandSwitcher } from '@/components/brand/brand-switcher'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useCreateOrg } from '@/hooks/use-orgs'
import { useOrgContext } from '@/contexts/org-context'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/brands', icon: Palette, label: 'Brands' },
]

export function Sidebar() {
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const createOrg = useCreateOrg()
  const { setActiveOrg } = useOrgContext()

  async function handleCreate() {
    if (!name.trim()) return
    const org = await createOrg.mutateAsync(name.trim())
    setActiveOrg(org)
    setShowNew(false)
    setName('')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <aside className="flex h-full w-56 flex-col border-r bg-white">
        <div className="p-4 border-b">
          <BrandSwitcher onCreateNew={() => setShowNew(true)} />
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-gray-100 font-medium text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="brand-name">Name</Label>
              <Input
                id="brand-name"
                placeholder="Acme Co."
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createOrg.isPending || !name.trim()}>
                {createOrg.isPending ? 'Creating…' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
