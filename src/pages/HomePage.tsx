import PageShell from '../components/PageShell'

export default function HomePage() {
  return (
    <PageShell
      title="Foyer Manager"
      subtitle="Gérez facilement les foyers universitaires, les étudiants et les réservations."
    >
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900">
            Gestion simple et efficace
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Une plateforme moderne pour gérer les logements étudiants, suivre les capacités
            et centraliser les réservations en toute simplicité.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
              Commencer
            </button>
            <button className="px-5 py-2 rounded-xl border text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              En savoir plus
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-900">
              Infrastructures
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Gérez universités, foyers, blocs et chambres.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-900">
              Étudiants
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Inscription, mise à jour et suivi des profils.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-900">
              Réservations
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Attribution des chambres avec contrôle de capacité.
            </p>
          </div>

        </div>

        {/* Info Section */}
        <div className="border rounded-xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            Connectez-vous pour accéder au système et gérer toutes les opérations.
          </p>
        </div>

      </div>
    </PageShell>
  )
}