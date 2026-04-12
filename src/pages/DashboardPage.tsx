import { useEffect, useState } from 'react'
import {
  getBlocs,
  getChambres,
  getEtudiants,
  getFoyers,
  getReservations,
  getUniversites,
} from '../services/api'
import { Box, Card, CardContent, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material'

interface DashboardCounts {
  universites: number
  foyers: number
  blocs: number
  chambres: number
  etudiants: number
  reservations: number
}

const initialCounts: DashboardCounts = {
  universites: 0,
  foyers: 0,
  blocs: 0,
  chambres: 0,
  etudiants: 0,
  reservations: 0,
}

const cards = [
  { label: 'Universités', key: 'universites' },
  { label: 'Foyers', key: 'foyers' },
  { label: 'Blocs', key: 'blocs' },
  { label: 'Chambres', key: 'chambres' },
  { label: 'Étudiants', key: 'etudiants' },
  { label: 'Réservations', key: 'reservations' },
] as const

export default function DashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>(initialCounts)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [universites, foyers, blocs, chambres, etudiants, reservations] = await Promise.all([
          getUniversites(),
          getFoyers(),
          getBlocs(),
          getChambres(),
          getEtudiants(),
          getReservations(),
        ])

        setCounts({
          universites: universites.length,
          foyers: foyers.length,
          blocs: blocs.length,
          chambres: chambres.length,
          etudiants: etudiants.length,
          reservations: reservations.length,
        })
      } catch (err) {
        setError(`Impossible de charger les indicateurs : ${err}`)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [])

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Système d'information pour la gestion des foyers universitaires et l'affectation des chambres.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: { xs: '1 1 auto', md: '2 1 auto' } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              {cards.map((card) => (
                <Card key={card.key} sx={{ flex: '1 1 30%', minWidth: 200 }} elevation={2}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" gutterBottom variant="subtitle2" textTransform="uppercase">
                      {card.label}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {counts[card.key]}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Card elevation={2} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Objectif du projet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Ce mini-projet consiste à concevoir et développer un système d'information complet dédié à la gestion des foyers universitaires.
                  L'objectif principal est de dématérialiser les processus administratifs liés à l'hébergement, fluidifier l'affectation des chambres,
                  contrôler les capacités d'accueil des bâtiments et centraliser les réservations étudiantes.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 auto' }, minWidth: { md: '300px' } }}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Fonctionnalités clés
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Affectation des chambres</Typography>
                    <Typography variant="body2" color="text.secondary">Planifiez les affectations et restez informé des disponibilités.</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Contrôle des capacités</Typography>
                    <Typography variant="body2" color="text.secondary">Supervisez les capacités des foyers et des blocs en temps réel.</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Centralisation des réservations</Typography>
                    <Typography variant="body2" color="text.secondary">Consolidez toutes les réservations étudiantes dans une seule interface.</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Gestion des étudiants</Typography>
                    <Typography variant="body2" color="text.secondary">Gérez les profils étudiants et leurs réservations associées.</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  )
}
