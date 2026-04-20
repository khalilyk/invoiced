import { useNavigate } from 'react-router-dom'
import { InvoiceForm } from '@/components/invoices/invoice-form'
import { useCreateInvoice } from '@/hooks/use-invoices'
import { useClients } from '@/hooks/use-clients'
import { useOrgContext } from '@/contexts/org-context'
import type { Invoice } from '@/types'

export default function NewInvoice() {
  const navigate = useNavigate()
  const { activeOrg } = useOrgContext()
  const create = useCreateInvoice()
  const { data: clients = [] } = useClients(activeOrg?.id)

  async function handleSave(data: Omit<Invoice, 'id' | 'created_at' | 'client'>) {
    const inv = await create.mutateAsync(data)
    navigate(`/invoices/${inv.id}`)
  }

  if (!activeOrg) return <div className="p-8 text-muted-foreground">Select a brand first.</div>

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">New invoice</h1>
      <InvoiceForm clients={clients} onSave={handleSave} orgId={activeOrg.id} isSaving={create.isPending} />
    </div>
  )
}
