import { useEffect } from 'react'
import type { Invoice, Organization } from '@/types'
import { calcInvoiceTotals } from '@/hooks/use-invoices'
import { STATUS_LABELS } from '@/types'

type Props = {
  invoice: Invoice
  org: Organization
}

export function InvoicePreview({ invoice, org }: Props) {
  const { brand } = org
  const { subtotal, tax, total } = calcInvoiceTotals(invoice)
  const fmt = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })

  // Dynamically load the brand font from Google Fonts
  useEffect(() => {
    const id = `gfont-${brand.font_family.replace(/\s+/g, '-')}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brand.font_family)}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
  }, [brand.font_family])

  const styles: React.CSSProperties = {
    fontFamily: `'${brand.font_family}', sans-serif`,
    fontSize: `${brand.font_size_base}px`,
    color: brand.primary_color,
    backgroundColor: '#ffffff',
  }

  return (
    <div style={styles} className="w-full max-w-2xl mx-auto p-12 shadow-sm border print:shadow-none print:border-none">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={org.name} className="h-12 object-contain mb-2" />
          ) : (
            <p style={{ fontSize: `${brand.heading_size}px`, fontWeight: 700, color: brand.primary_color }} className="leading-tight">
              {org.name}
            </p>
          )}
          <div className="mt-2 text-sm opacity-70 space-y-0.5">
            {brand.address && <p>{brand.address}</p>}
            {brand.email && <p>{brand.email}</p>}
            {brand.phone && <p>{brand.phone}</p>}
            {brand.website && <p>{brand.website}</p>}
          </div>
        </div>
        <div className="text-right">
          <p style={{ fontSize: `${brand.heading_size}px`, fontWeight: 700 }}>INVOICE</p>
          <p className="text-sm opacity-70 mt-1">{invoice.number}</p>
          <span
            className="inline-block mt-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: brand.accent_color }}
          >
            {STATUS_LABELS[invoice.status]}
          </span>
        </div>
      </div>

      {/* Dates + Bill to */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1">Bill to</p>
          <p className="font-semibold">{invoice.client?.name ?? '—'}</p>
          {invoice.client?.company && <p className="text-sm opacity-70">{invoice.client.company}</p>}
          {invoice.client?.address && <p className="text-sm opacity-70 whitespace-pre-line">{invoice.client.address}</p>}
          {invoice.client?.email && <p className="text-sm opacity-70">{invoice.client.email}</p>}
        </div>
        <div className="text-right">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50">Issue date</p>
            <p className="text-sm">{new Date(invoice.issue_date).toLocaleDateString('en-AU', { dateStyle: 'medium' })}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50">Due date</p>
            <p className="text-sm font-semibold">{new Date(invoice.due_date).toLocaleDateString('en-AU', { dateStyle: 'medium' })}</p>
          </div>
        </div>
      </div>

      {/* Line items */}
      <table className="w-full mb-8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${brand.primary_color}` }}>
            <th className="text-left py-2 text-xs font-semibold uppercase tracking-widest opacity-50">Description</th>
            <th className="text-right py-2 text-xs font-semibold uppercase tracking-widest opacity-50">Qty</th>
            <th className="text-right py-2 text-xs font-semibold uppercase tracking-widest opacity-50">Unit price</th>
            <th className="text-right py-2 text-xs font-semibold uppercase tracking-widest opacity-50">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id ?? i} style={{ borderBottom: `1px solid ${brand.secondary_color}` }}>
              <td className="py-3">{item.description}</td>
              <td className="py-3 text-right opacity-70">{item.quantity}</td>
              <td className="py-3 text-right opacity-70">{fmt(item.unit_price)}</td>
              <td className="py-3 text-right font-medium">{fmt(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-56 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="opacity-70">Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="opacity-70">Tax ({invoice.tax_rate}%)</span><span>{fmt(tax)}</span>
            </div>
          )}
          <div
            className="flex justify-between font-semibold pt-2 mt-2"
            style={{ borderTop: `2px solid ${brand.primary_color}`, fontSize: `${brand.font_size_base + 2}px` }}
          >
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes + footer */}
      {invoice.notes && (
        <div className="mt-10 pt-6" style={{ borderTop: `1px solid ${brand.secondary_color}` }}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-1">Notes</p>
          <p className="text-sm opacity-70 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
      {brand.footer_note && (
        <p className="mt-8 text-xs text-center opacity-40">{brand.footer_note}</p>
      )}
    </div>
  )
}
