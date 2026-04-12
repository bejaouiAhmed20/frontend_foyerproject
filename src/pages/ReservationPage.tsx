import { useEffect, useState } from 'react'
import type { ReservationDto } from '../types/entities'
import { createReservation, deleteReservation, getReservations, updateReservation, validateReservation, cancelReservation } from '../services/api'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const initialReservation: ReservationDto = {
  idReservation: '',
  anneeUniversitaire: '',
  estValide: false,
  etudiants: [],
}

export default function ReservationPage() {
  const [reservations, setReservations] = useState<ReservationDto[]>([])
  const [form, setForm] = useState<ReservationDto>(initialReservation)
  const [etudiantsField, setEtudiantsField] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const loadReservations = async () => {
    try {
      const data = await getReservations()
      setReservations(data)
    } catch (error) {
      console.error('Unable to load reservations')
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialReservation)
    setEtudiantsField('')
    setSelectedId(null)
  }

  const parseEtudiants = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((id) => ({ idEtudiant: Number(id) }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const payload: ReservationDto = {
        ...form,
        etudiants: parseEtudiants(etudiantsField),
      }

      if (selectedId) {
        await updateReservation(payload)
      } else {
        await createReservation(payload)
      }
      await loadReservations()
      handleClose()
    } catch (error) {
      console.error('Save failed')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await deleteReservation(id)
      await loadReservations()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleValidate = async (id?: string) => {
    if (!id) return
    try {
      await validateReservation(id)
      await loadReservations()
    } catch (error) {
      console.error('Validation failed')
    }
  }

  const handleCancel = async (id?: string) => {
    if (!id) return
    try {
      await cancelReservation(id)
      await loadReservations()
    } catch (error) {
      console.error('Cancellation failed')
    }
  }

  const handleEdit = (reservation: ReservationDto) => {
    setSelectedId(reservation.idReservation)
    setForm({
      idReservation: reservation.idReservation,
      anneeUniversitaire: reservation.anneeUniversitaire,
      estValide: reservation.estValide,
      etudiants: reservation.etudiants ?? [],
    })
    setEtudiantsField((reservation.etudiants ?? []).map((ref) => ref.idEtudiant).join(', '))
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Réservations
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Ajouter
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'slate.50' }}>
            <TableRow>
              <TableCell><strong>ID Réservation</strong></TableCell>
              <TableCell><strong>Année Universitaire</strong></TableCell>
              <TableCell><strong>Valide ?</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.idReservation}>
                <TableCell>{reservation.idReservation}</TableCell>
                <TableCell>{reservation.anneeUniversitaire}</TableCell>
                <TableCell>
                  <Typography color={reservation.estValide ? 'success.main' : 'error.main'} fontWeight={500}>
                    {reservation.estValide ? 'Oui' : 'Non'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Valider">
                    <IconButton color="success" onClick={() => handleValidate(reservation.idReservation)}>
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Annuler">
                    <IconButton color="warning" onClick={() => handleCancel(reservation.idReservation)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton color="primary" onClick={() => handleEdit(reservation)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" onClick={() => handleDelete(reservation.idReservation)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucune réservation trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Réservation' : 'Ajouter Réservation'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="ID Réservation"
                fullWidth
                required
                value={form.idReservation}
                onChange={(e) => setForm({ ...form, idReservation: e.target.value })}
                disabled={!!selectedId}
              />
              <TextField
                label="Année Universitaire"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.anneeUniversitaire}
                onChange={(e) => setForm({ ...form, anneeUniversitaire: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.estValide}
                    onChange={(e) => setForm({ ...form, estValide: e.target.checked })}
                    color="primary"
                  />
                }
                label="Est Valide"
              />
              <TextField
                label="IDs Étudiants (séparés par des virgules)"
                fullWidth
                placeholder="1, 2, 3"
                value={etudiantsField}
                onChange={(e) => setEtudiantsField(e.target.value)}
                helperText="Saisissez les IDs des étudiants concernés."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">Annuler</Button>
            <Button type="submit" variant="contained">
              {selectedId ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
