import { useEffect, useState } from 'react'
import type { ReservationDto, ReservationPayloadDto, ChambreDto, EtudiantDto } from '../types/entities'
import { createReservation, deleteReservation, getReservations, updateReservation, validateReservation, cancelReservation, getChambres, getEtudiants } from '../services/api'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const initialPayload = {
  idReservation: '',
  anneeUniversitaire: '',
  estValide: false,
  chambreId: '' as number | '',
}

export default function ReservationPage() {
  const [reservations, setReservations] = useState<ReservationDto[]>([])
  const [chambres, setChambres] = useState<ChambreDto[]>([])
  const [etudiants, setEtudiants] = useState<EtudiantDto[]>([])
  const [form, setForm] = useState(initialPayload)
  const [selectedEtudiantIds, setSelectedEtudiantIds] = useState<number[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const loadData = async () => {
    try {
      const [resData, chData, etData] = await Promise.all([getReservations(), getChambres(), getEtudiants()])
      setReservations(resData)
      setChambres(chData)
      setEtudiants(etData)
    } catch (error) {
      console.error('Unable to load data')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialPayload)
    setSelectedEtudiantIds([])
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const payload: ReservationPayloadDto = {
        idReservation: form.idReservation || `${form.anneeUniversitaire.substring(0, 4)}-${form.chambreId}-${crypto.randomUUID().substring(0, 8)}`,
        anneeUniversitaire: form.anneeUniversitaire,
        estValide: form.estValide,
        chambreId: Number(form.chambreId),
        etudiantIds: selectedEtudiantIds,
      }

      if (selectedId) {
        await updateReservation(payload)
      } else {
        await createReservation(payload)
      }
      await loadData()
      handleClose()
    } catch (error: any) {
      console.error('Save failed', error)
      alert(error.message || 'Une erreur est survenue lors de la sauvegarde.')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await deleteReservation(id)
      await loadData()
    } catch (error: any) {
      console.error('Delete failed', error)
      alert(error.message || 'Une erreur est survenue lors de la suppression.')
    }
  }

  const handleValidate = async (id?: string) => {
    if (!id) return
    try {
      await validateReservation(id)
      await loadData()
    } catch (error: any) {
      console.error('Validation failed', error)
      alert(error.message || 'Une erreur est survenue lors de la validation.')
    }
  }

  const handleCancel = async (id?: string) => {
    if (!id) return
    try {
      await cancelReservation(id)
      await loadData()
    } catch (error: any) {
      console.error('Cancellation failed', error)
      alert(error.message || "Une erreur est survenue lors de l'annulation.")
    }
  }

  const handleEdit = (reservation: ReservationDto) => {
    setSelectedId(reservation.idReservation)
    setForm({
      idReservation: reservation.idReservation,
      anneeUniversitaire: reservation.anneeUniversitaire,
      estValide: reservation.estValide,
      chambreId: '', // Default since nested chambre is not directly available in ReservationDto
    })
    setSelectedEtudiantIds((reservation.etudiants ?? []).map((ref) => ref.idEtudiant))
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
                label="Année Universitaire"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.anneeUniversitaire}
                onChange={(e) => setForm({ ...form, anneeUniversitaire: e.target.value })}
              />
              <FormControl fullWidth required>
                <InputLabel>Chambre</InputLabel>
                <Select
                  value={form.chambreId}
                  label="Chambre"
                  onChange={(e) => setForm({ ...form, chambreId: Number(e.target.value) })}
                >
                  {chambres.map((chambre) => (
                    <MenuItem key={chambre.idChambre} value={chambre.idChambre}>
                      Chambre {chambre.numeroChambre} ({chambre.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControl fullWidth required>
                <InputLabel>Étudiants</InputLabel>
                <Select
                  multiple
                  value={selectedEtudiantIds}
                  label="Étudiants"
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedEtudiantIds(typeof value === 'string' ? value.split(',').map(Number) : value as number[])
                  }}
                >
                  {etudiants.map((etudiant) => (
                    <MenuItem key={etudiant.idEtudiant} value={etudiant.idEtudiant}>
                      {etudiant.nomEt} {etudiant.prenomEt} (CIN: {etudiant.cin})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
