import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import DashboardPage from './pages/DashboardPage'
import UniversitePage from './pages/UniversitePage'
import FoyerPage from './pages/FoyerPage'
import BlocPage from './pages/BlocPage'
import ChambrePage from './pages/ChambrePage'
import EtudiantPage from './pages/EtudiantPage'
import ReservationPage from './pages/ReservationPage'
import LoginPage from './pages/LoginPage'
import ChatbotBubble from './components/ChatbotBubble'  // ← AJOUT

const adminTabs = [
  { key: 'dashboard', label: 'Tableau de bord' },
  { key: 'universite', label: 'Universités' },
  { key: 'foyer', label: 'Foyers' },
  { key: 'bloc', label: 'Blocs' },
  { key: 'chambre', label: 'Chambres' },
  { key: 'etudiant', label: 'Étudiants' },
  { key: 'reservation', label: 'Réservations' },
] as const

type TabKey = (typeof adminTabs)[number]['key']

function AppRoutes({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname.split('/')[1]
  const activeTab: TabKey = (adminTabs.map((t) => t.key).includes(currentPath as TabKey)
    ? currentPath
    : 'dashboard') as TabKey

  return (
    <>
      <MainLayout
        tabs={adminTabs}
        activeTab={activeTab}
        onSelect={(key) => navigate(`/${key}`)}
        userEmail={userEmail}
        onLogout={onLogout}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/universite" element={<UniversitePage />} />
          <Route path="/foyer" element={<FoyerPage />} />
          <Route path="/bloc" element={<BlocPage />} />
          <Route path="/chambre" element={<ChambrePage />} />
          <Route path="/etudiant" element={<EtudiantPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>

      {/* Chatbot flottant — visible sur toutes les pages */}
      <ChatbotBubble />  {/* ← AJOUT */}
    </>
  )
}

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(() => sessionStorage.getItem('userEmail'))

  const handleLogin = (payload: { email: string }) => {
    sessionStorage.setItem('userEmail', payload.email)
    setUserEmail(payload.email)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail')
    setUserEmail(null)
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoginPage onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppRoutes userEmail={userEmail} onLogout={handleLogout} />
    </BrowserRouter>
  )
}

export default App

