import { useState } from 'react'
import PageShell from '../components/PageShell'

interface LoginPageProps {
  onLogin: (payload: { email: string }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin') {
      onLogin({ email: username })
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.')
    }
  }

  return (
    <PageShell title="Connexion" subtitle="Accédez à l'espace administrateur">
      <div className="flex justify-center">
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 border rounded-xl p-6 bg-white"
        >
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="admin"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Se connecter
          </button>

          {/* Hint */}
          <p className="text-xs text-slate-500 text-center">
            Accès restreint au personnel administratif uniquement.
          </p>
        </form>

      </div>
    </PageShell>
  )
}
