import { Link } from 'react-router-dom'
import { Palette, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrgs, useDeleteOrg } from '@/hooks/use-orgs'
import { useOrgContext } from '@/contexts/org-context'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateOrg } from '@/hooks/use-orgs'

export default function Brands() {
  const { data: orgs = [] } = useOrgs()
  const deleteOrg = useDeleteOrg()
  const createOrg = useCreateOrg()
  const { activeOrg, setActiveOrg } = useOrgContext()
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')

  async function handleCreate() {
    if (!name.trim()) return
    const org = await createOrg.mutateAsync(name.trim())
    setActiveOrg(org)
    setShowNew(false)
    setName('')
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <Button onClick={() => setShowNew(true)}><Plus className="mr-2 size-4" />New brand</Button>
      </div>

      {orgs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No brands yet. Create one to start.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map(org => (
            <div key={org.id} className="rounded-lg border bg-white p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div
                  className="size-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: org.brand.primary_color }}
                >
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => {
                    if (confirm(`Delete "${org.name}"?`)) deleteOrg.mutate(org.id)
                  }}
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </div>
              <div>
                <p className="font-semibold">{org.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{org.brand.font_family} · {org.brand.font_size_base}px</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/brands/${org.id}/settings`} onClick={() => setActiveOrg(org)}>
                    <Palette className="mr-1.5 size-4" />Customise
                  </Link>
                </Button>
                {activeOrg?.id !== org.id && (
                  <Button variant="ghost" size="sm" onClick={() => setActiveOrg(org)}>Switch</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>New brand</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Acme Co." value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus />
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
    </div>
  )
}
