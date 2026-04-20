import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useOrgContext } from '@/contexts/org-context'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/use-clients'
import type { Client } from '@/types'

type Form = Omit<Client, 'id' | 'created_at' | 'org_id'>
const EMPTY: Form = { name: '', email: '', phone: '', address: '', company: '' }

export default function Clients() {
  const { activeOrg } = useOrgContext()
  const { data: clients = [] } = useClients(activeOrg?.id)
  const create = useCreateClient()
  const update = useUpdateClient()
  const remove = useDeleteClient()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true) }
  function openEdit(c: Client) { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, company: c.company }); setOpen(true) }

  async function handleSave() {
    if (!activeOrg) return
    if (editing) {
      await update.mutateAsync({ id: editing.id, org_id: activeOrg.id, ...form })
    } else {
      await create.mutateAsync({ org_id: activeOrg.id, ...form })
    }
    setOpen(false)
  }

  function field(key: keyof Form) {
    return { value: form[key] ?? '', onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [key]: e.target.value })) }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Button onClick={openNew} disabled={!activeOrg}><Plus className="mr-2 size-4" />Add client</Button>
      </div>

      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clients yet. Add one to start invoicing.</p>
      ) : (
        <div className="space-y-2">
          {clients.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{[c.company, c.email].filter(Boolean).join(' · ')}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate({ id: c.id, orgId: activeOrg!.id })}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit client' : 'New client'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {([['name', 'Name'], ['company', 'Company'], ['email', 'Email'], ['phone', 'Phone']] as [keyof Form, string][]).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} {...field(key)} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={3} {...field('address')} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={create.isPending || update.isPending || !form.name.trim()}>
                {create.isPending || update.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
