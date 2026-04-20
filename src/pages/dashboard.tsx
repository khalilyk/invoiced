import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrgContext } from '@/contexts/org-context'
import { useInvoices, calcInvoiceTotals } from '@/hooks/use-invoices'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const { activeOrg } = useOrgContext()
  const { data: invoices = [] } = useInvoices(activeOrg?.id)

  const stats = useMemo(() => {
    const total = invoices.length
    const paid = invoices.filter(i => i.status === 'paid')
    const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
    const paidTotal = paid.reduce((s, i) => s + calcInvoiceTotals(i).total, 0)
    const outstandingTotal = outstanding.reduce((s, i) => s + calcInvoiceTotals(i).total, 0)
    return { total, paidTotal, outstandingTotal, overdueCount: invoices.filter(i => i.status === 'overdue').length }
  }, [invoices])

  const fmt = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })

  if (!activeOrg) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Create a brand to get started.</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{activeOrg.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening.</p>
        </div>
        <Button asChild>
          <Link to="/invoices/new">New invoice</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total invoices</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collected</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(stats.paidTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(stats.outstandingTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <Clock className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">{stats.overdueCount}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet. <Link to="/invoices/new" className="underline">Create your first invoice.</Link></p>
        ) : (
          <div className="space-y-2">
            {invoices.slice(0, 5).map(inv => (
              <Link key={inv.id} to={`/invoices/${inv.id}`}
                className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{inv.number}</p>
                  <p className="text-xs text-muted-foreground">{inv.client?.name ?? '—'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[inv.status])}>
                    {STATUS_LABELS[inv.status]}
                  </span>
                  <p className="text-sm font-medium">{fmt(calcInvoiceTotals(inv).total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
