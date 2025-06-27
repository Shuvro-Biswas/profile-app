import { useEffect } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { store } from './store/store'
import { verifyToken } from './store/slices/authSlice'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { Loader2 } from 'lucide-react'
import './App.css'

function AppContent() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is already logged in on app start
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

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
          }
        />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App

