import { Navigate } from 'react-router-dom'
import { useSession } from '@/hooks/use-session'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { session, loading } = useSession()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
