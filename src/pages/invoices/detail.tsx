import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Printer, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvoiceForm } from '@/components/invoices/invoice-form'
import { InvoicePreview } from '@/components/invoices/invoice-preview'
import { useInvoice, useUpdateInvoice, useDeleteInvoice } from '@/hooks/use-invoices'
import { useClients } from '@/hooks/use-clients'
import { useOrgContext } from '@/contexts/org-context'
import type { Invoice } from '@/types'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeOrg } = useOrgContext()
  const { data: invoice, isLoading } = useInvoice(id)
  const { data: clients = [] } = useClients(activeOrg?.id)
  const update = useUpdateInvoice()
  const remove = useDeleteInvoice()
  const [editing, setEditing] = useState(false)

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading…</div>
  if (!invoice || !activeOrg) return <div className="p-8 text-muted-foreground">Invoice not found.</div>

  async function handleSave(data: Omit<Invoice, 'id' | 'created_at' | 'client'>) {
    await update.mutateAsync({ id: invoice!.id, ...data })
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this invoice?')) return
    await remove.mutateAsync({ id: invoice!.id, orgId: activeOrg!.id })
    navigate('/invoices')
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{invoice.number}</h1>
        <div className="flex gap-2">
          {!editing && (
            <>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 size-4" />Print
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="mr-2 size-4" />Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 size-4" />Delete
              </Button>
            </>
          )}
          {editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              <X className="mr-2 size-4" />Cancel
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <InvoiceForm
          initial={invoice}
          clients={clients}
          onSave={handleSave}
          orgId={activeOrg.id}
          isSaving={update.isPending}
        />
      ) : (
        <InvoicePreview invoice={invoice} org={activeOrg} />
      )}
    </div>
  )
}
