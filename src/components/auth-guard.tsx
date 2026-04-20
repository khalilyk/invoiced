import { Navigate } from 'react-router-dom'
import { useSession } from '@/hooks/use-session'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { session, loading } = useSession()

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
    </div>
  )
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
