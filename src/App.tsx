import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OrgProvider } from '@/contexts/org-context'
import { OrgLoader } from '@/components/org-loader'
import { AuthGuard } from '@/components/auth-guard'
import { AppLayout } from '@/components/layout/app-layout'

import Login from '@/pages/login'
import Register from '@/pages/register'
import Dashboard from '@/pages/dashboard'
import Invoices from '@/pages/invoices/index'
import NewInvoice from '@/pages/invoices/new'
import InvoiceDetail from '@/pages/invoices/detail'
import Clients from '@/pages/clients'
import Brands from '@/pages/brands'
import BrandSettings from '@/pages/brand-settings'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrgProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AuthGuard><OrgLoader><AppLayout /></OrgLoader></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/new" element={<NewInvoice />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="clients" element={<Clients />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/:id/settings" element={<BrandSettings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </OrgProvider>
    </QueryClientProvider>
  )
}
