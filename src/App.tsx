import { Routes, Route, Navigate } from 'react-router-dom'
import { LucidFlowPage } from './pages/LucidFlowPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminForgotPasswordPage } from './pages/AdminForgotPasswordPage'
import { AdminResetPasswordPage } from './pages/AdminResetPasswordPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLeadsPage } from './pages/AdminLeadsPage'
import { AdminLeadDetailPage } from './pages/AdminLeadDetailPage'
import { DepthBackground } from './components/motion/DepthBackground'
import { useGA4Init } from './hooks/useGA4'

function App() {
  useGA4Init();

  return (
    <>
      <DepthBackground />
      <div className="relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/lucidflow" replace />} />
          <Route path="/lucidflow" element={<LucidFlowPage />} />
          <Route path="/lucidflow/thank-you" element={<ThankYouPage />} />

          {/* Admin Routes */}
          <Route path="/admin-panel" element={<AdminLoginPage />} />
          <Route path="/admin-panel/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admin-panel/reset-password" element={<AdminResetPasswordPage />} />
          <Route path="/admin-panel/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-panel/leads" element={<AdminLeadsPage />} />
          <Route path="/admin-panel/leads/:id" element={<AdminLeadDetailPage />} />

          {/* Catch all - redirect to lucidflow */}
          <Route path="*" element={<Navigate to="/lucidflow" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
