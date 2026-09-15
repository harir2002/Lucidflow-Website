import { Routes, Route, Navigate } from 'react-router-dom'
import { LucidFlowPage } from './pages/LucidFlowPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { DepthBackground } from './components/motion/DepthBackground'

function App() {
  return (
    <>
      <DepthBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/lucidflow" replace />} />
          <Route path="/lucidflow" element={<LucidFlowPage />} />
          <Route path="/lucidflow/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/lucidflow" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
