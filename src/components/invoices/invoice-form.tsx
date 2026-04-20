import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Client, Invoice, InvoiceItem, InvoiceStatus } from '@/types'
import { calcInvoiceTotals } from '@/hooks/use-invoices'
import { nanoid } from '@/lib/utils'

type Props = {
  initial?: Partial<Invoice>
  clients: Client[]
  onSave: (data: Omit<Invoice, 'id' | 'created_at' | 'client'>) => Promise<void>
  orgId: string
  isSaving: boolean
}

export function InvoiceForm({ initial, clients, onSave, orgId, isSaving }: Props) {
  const [clientId, setClientId] = useState(initial?.client_id ?? '')
  const [number, setNumber] = useState(() => initial?.number ?? `INV-${Date.now().toString().slice(-6)}`)
  const [status, setStatus] = useState<InvoiceStatus>(initial?.status ?? 'draft')
  const [issueDate, setIssueDate] = useState(() => initial?.issue_date ?? new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => initial?.due_date ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0])
  const [taxRate, setTaxRate] = useState(initial?.tax_rate ?? 10)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [items, setItems] = useState<InvoiceItem[]>(
    initial?.items?.length ? initial.items : [{ id: nanoid(), description: '', quantity: 1, unit_price: 0 }]
  )

  function addItem() {
    setItems(prev => [...prev, { id: nanoid(), description: '', quantity: 1, unit_price: 0 }])
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const { subtotal, tax, total } = calcInvoiceTotals({ items, tax_rate: taxRate })
  const fmt = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })

  async function handleSave() {
    await onSave({ org_id: orgId, client_id: clientId, number, status, issue_date: issueDate, due_date: dueDate, tax_rate: taxRate, notes: notes || null, items })
  }

  return (
    <div className="space-y-8">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Invoice #</Label>
          <Input value={number} onChange={e => setNumber(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={v => setStatus(v as InvoiceStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['draft', 'sent', 'paid', 'overdue'] as const).map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Issue date</Label>
          <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Due date</Label>
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>

      {/* Client */}
      <div className="space-y-1.5">
        <Label>Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select client…" /></SelectTrigger>
          <SelectContent>
            {clients.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Line items */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
          <span className="col-span-6">Description</span>
          <span className="col-span-2 text-right">Qty</span>
          <span className="col-span-3 text-right">Unit price</span>
          <span />
        </div>
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <Input className="col-span-6" placeholder="Item description" value={item.description}
              onChange={e => updateItem(item.id, 'description', e.target.value)} />
            <Input className="col-span-2 text-right" type="number" min={1} value={item.quantity}
              onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
            <Input className="col-span-3 text-right" type="number" min={0} step={0.01} value={item.unit_price}
              onChange={e => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)} />
            <Button variant="ghost" size="icon" className="col-span-1" onClick={() => removeItem(item.id)}
              disabled={items.length === 1}>
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addItem} className="text-muted-foreground">
          <Plus className="mr-1.5 size-4" />Add line
        </Button>
      </div>

      {/* Totals + tax */}
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-1.5 w-40">
          <Label>Tax rate (%)</Label>
          <Input type="number" min={0} max={100} value={taxRate}
            onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-muted-foreground">Subtotal: {fmt(subtotal)}</p>
          {taxRate > 0 && <p className="text-sm text-muted-foreground">Tax ({taxRate}%): {fmt(tax)}</p>}
          <p className="text-base font-semibold">Total: {fmt(total)}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea placeholder="Payment terms, bank details, thank-you note…" rows={3}
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <Button onClick={handleSave} disabled={isSaving || !clientId || items.every(i => !i.description)}>
        {isSaving ? 'Saving…' : 'Save invoice'}
      </Button>
    </div>
  )
}
