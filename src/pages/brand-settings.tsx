import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useOrgs, useUpdateBrand } from '@/hooks/use-orgs'
import { useOrgContext } from '@/contexts/org-context'
import { FONT_OPTIONS, type BrandSettings } from '@/types'
import { InvoicePreview } from '@/components/invoices/invoice-preview'
import type { Invoice, Organization } from '@/types'

const PREVIEW_INVOICE: Invoice = {
  id: 'preview', org_id: '', client_id: '', number: 'INV-001',
  status: 'sent', issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  notes: 'Payment due within 30 days. Thank you for your business.',
  tax_rate: 10, created_at: '',
  items: [
    { id: '1', description: 'Brand strategy & identity', quantity: 1, unit_price: 4500 },
    { id: '2', description: 'Website design (5 pages)', quantity: 1, unit_price: 3200 },
    { id: '3', description: 'Copywriting', quantity: 8, unit_price: 150 },
  ],
  client: { id: 'c1', org_id: '', name: 'Sample Client', company: 'Example Ltd.', email: 'hello@example.com', phone: null, address: '123 Demo Street\nSydney NSW 2000', created_at: '' },
}

export default function BrandSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: orgs = [] } = useOrgs()
  const { setActiveOrg } = useOrgContext()
  const update = useUpdateBrand()

  const org = orgs.find(o => o.id === id)
  const [overrides, setOverrides] = useState<Partial<BrandSettings>>({})

  if (!org) return <div className="p-8 text-muted-foreground">Loading…</div>

  const brand: BrandSettings = { ...org.brand, ...overrides }

  function set<K extends keyof BrandSettings>(key: K, value: BrandSettings[K]) {
    setOverrides(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!brand) return
    const updated = await update.mutateAsync({ orgId: org!.id, brand })
    setActiveOrg(updated)
  }

  const previewOrg: Organization = { ...org, brand }

  return (
    <div className="flex h-full">
      {/* Settings panel */}
      <div className="w-80 shrink-0 border-r bg-white overflow-y-auto">
        <div className="p-5 border-b flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/brands')}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <p className="font-semibold text-sm">{org.name}</p>
            <p className="text-xs text-muted-foreground">Brand settings</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Typography */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Typography</h3>
            <div className="space-y-1.5">
              <Label>Font family</Label>
              <Select value={brand.font_family} onValueChange={v => set('font_family', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>Body size (px)</Label>
                <Input type="number" min={10} max={20} value={brand.font_size_base}
                  onChange={e => set('font_size_base', parseInt(e.target.value) || 14)} />
              </div>
              <div className="space-y-1.5">
                <Label>Heading size (px)</Label>
                <Input type="number" min={16} max={48} value={brand.heading_size}
                  onChange={e => set('heading_size', parseInt(e.target.value) || 24)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Colours */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Colours</h3>
            {([
              ['primary_color', 'Primary (text & borders)'],
              ['secondary_color', 'Secondary (backgrounds)'],
              ['accent_color', 'Accent (badges, highlights)'],
            ] as [keyof BrandSettings, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm">{label}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brand[key] as string}
                    onChange={e => set(key, e.target.value)}
                    className="size-8 rounded cursor-pointer border"
                  />
                  <Input className="w-24 font-mono text-xs" value={brand[key] as string}
                    onChange={e => set(key, e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Business info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Business info</h3>
            {([
              ['email', 'Email', 'text'],
              ['phone', 'Phone', 'text'],
              ['website', 'Website', 'text'],
            ] as [keyof BrandSettings, string, string][]).map(([key, label, type]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input type={type} value={(brand[key] as string) ?? ''}
                  onChange={e => set(key, e.target.value || null)} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Textarea rows={3} value={brand.address ?? ''}
                onChange={e => set('address', e.target.value || null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Footer note</Label>
              <Input placeholder="e.g. ABN 12 345 678 910" value={brand.footer_note ?? ''}
                onChange={e => set('footer_note', e.target.value || null)} />
            </div>
          </div>

          <Button className="w-full" onClick={handleSave} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <p className="text-xs text-center text-muted-foreground mb-6 uppercase tracking-widest">Live preview</p>
        <InvoicePreview invoice={PREVIEW_INVOICE} org={previewOrg} />
      </div>
    </div>
  )
}
