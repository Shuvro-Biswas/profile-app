import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { verifyToken } from '../store/slices/authSlice'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyToken())
    }
  }, [dispatch, token, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // This will be handled by the main App component
  }

  return children
}

