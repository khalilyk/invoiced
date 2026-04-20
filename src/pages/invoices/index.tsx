import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrgContext } from '@/contexts/org-context'
import { useInvoices, calcInvoiceTotals } from '@/hooks/use-invoices'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'
import { cn } from '@/lib/utils'

export default function Invoices() {
  const { activeOrg } = useOrgContext()
  const { data: invoices = [], isLoading } = useInvoices(activeOrg?.id)
  const fmt = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button asChild disabled={!activeOrg}>
          <Link to="/invoices/new"><Plus className="mr-2 size-4" />New invoice</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices yet. <Link to="/invoices/new" className="underline">Create one.</Link></p>
      ) : (
        <div className="rounded-lg border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Number</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Due</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/invoices/${inv.id}`} className="font-medium hover:underline">{inv.number}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.client?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(inv.due_date).toLocaleDateString('en-AU', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[inv.status])}>
                      {STATUS_LABELS[inv.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{fmt(calcInvoiceTotals(inv).total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
