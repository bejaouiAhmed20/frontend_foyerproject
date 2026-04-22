import { useEffect, useState } from 'react'
import type { EtudiantDto } from '../types/entities'
import { createEtudiant, deleteEtudiant, getEtudiants, updateEtudiant } from '../services/api'
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
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const initialEtudiant: EtudiantDto = {
  nomEt: '',
  prenomEt: '',
  cin: 0,
  ecole: '',
  dateNaissance: '',
}

export default function EtudiantPage() {
  const [etudiants, setEtudiants] = useState<EtudiantDto[]>([])
  const [form, setForm] = useState<EtudiantDto>(initialEtudiant)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadEtudiants = async () => {
    try {
      const data = await getEtudiants()
      setEtudiants(data)
    } catch (error) {
      console.error('Unable to load etudiants')
    }
  }

  useEffect(() => {
    loadEtudiants()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialEtudiant)
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (selectedId) {
        await updateEtudiant({ ...form, idEtudiant: selectedId })
      } else {
        await createEtudiant(form)
      }
      await loadEtudiants()
      handleClose()
    } catch (error) {
      console.error('Save failed')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteEtudiant(id)
      await loadEtudiants()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (etudiant: EtudiantDto) => {
    setSelectedId(etudiant.idEtudiant ?? null)
    setForm({
      nomEt: etudiant.nomEt,
      prenomEt: etudiant.prenomEt,
      cin: etudiant.cin,
      ecole: etudiant.ecole,
      dateNaissance: etudiant.dateNaissance,
    })
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Étudiants
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Ajouter
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'slate.50' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nom Complet</strong></TableCell>
              <TableCell><strong>CIN</strong></TableCell>
              <TableCell><strong>École</strong></TableCell>
              <TableCell><strong>Date Naissance</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {etudiants.map((etudiant) => (
              <TableRow key={etudiant.idEtudiant ?? etudiant.cin}>
                <TableCell>{etudiant.idEtudiant}</TableCell>
                <TableCell>{etudiant.nomEt} {etudiant.prenomEt}</TableCell>
                <TableCell>{etudiant.cin}</TableCell>
                <TableCell>{etudiant.ecole}</TableCell>
                <TableCell>{etudiant.dateNaissance}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(etudiant)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(etudiant.idEtudiant)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {etudiants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun étudiant trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Étudiant' : 'Ajouter Étudiant'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Nom"
                  fullWidth
                  required
                  value={form.nomEt}
                  onChange={(e) => setForm({ ...form, nomEt: e.target.value })}
                />
                <TextField
                  label="Prénom"
                  fullWidth
                  required
                  value={form.prenomEt}
                  onChange={(e) => setForm({ ...form, prenomEt: e.target.value })}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="CIN"
                  type="number"
                  fullWidth
                  required
                  value={form.cin}
                  onChange={(e) => setForm({ ...form, cin: Number(e.target.value) })}
                />
                <TextField
                  label="École"
                  fullWidth
                  required
                  value={form.ecole}
                  onChange={(e) => setForm({ ...form, ecole: e.target.value })}
                />
              </Box>
              <TextField
                label="Date de Naissance"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.dateNaissance}
                onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
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
