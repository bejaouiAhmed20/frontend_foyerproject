import type { MouseEventHandler } from 'react'

type TabItem = {
  key: string
  label: string
}

interface NavbarProps {
  tabs?: readonly TabItem[] // ✅ optional to avoid crash
  activeTab: string
  onSelect: (key: string) => void
  userEmail: string | null
  onLoginClick: () => void
  onLogout: MouseEventHandler<HTMLButtonElement>
}

export default function Navbar({
  tabs = [], 
  activeTab,
  onSelect,
  userEmail,
  onLoginClick,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
            F
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Foyer Manager
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onSelect(tab.key)}
              className={`text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden sm:block text-sm text-slate-500">
              {userEmail}
            </span>
          )}

          <button
            onClick={userEmail ? onLogout : onLoginClick}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {userEmail ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  )
}