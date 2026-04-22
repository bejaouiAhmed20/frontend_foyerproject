import { useEffect, useState } from 'react'
import type { FoyerDto, UniversiteDto } from '../types/entities'
import { createFoyer, deleteFoyer, getFoyers, updateFoyer, getUniversites, linkFoyerUniversite } from '../services/api'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const initialFoyer: FoyerDto = {
  nomFoyer: '',
  capaciteFoyer: 0,
}

export default function FoyerPage() {
  const [foyers, setFoyers] = useState<FoyerDto[]>([])
  const [universites, setUniversites] = useState<UniversiteDto[]>([])
  const [form, setForm] = useState<FoyerDto>(initialFoyer)
  const [selectedUniversiteId, setSelectedUniversiteId] = useState<number | ''>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadData = async () => {
    try {
      const [foyersData, universitesData] = await Promise.all([getFoyers(), getUniversites()])
      setFoyers(foyersData)
      setUniversites(universitesData)
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
    setForm(initialFoyer)
    setSelectedId(null)
    setSelectedUniversiteId('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      let savedFoyer: FoyerDto;
      if (selectedId) {
        savedFoyer = await updateFoyer({ ...form, idFoyer: selectedId })
      } else {
        savedFoyer = await createFoyer(form)
      }
      
      const foyerId = savedFoyer?.idFoyer || selectedId;
      if (foyerId && selectedUniversiteId !== '') {
        await linkFoyerUniversite(foyerId, selectedUniversiteId)
      }

      await loadData()
      handleClose()
    } catch (error) {
      console.error('Save failed')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteFoyer(id)
      await loadData()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (foyer: FoyerDto) => {
    setSelectedId(foyer.idFoyer ?? null)
    setForm({
      nomFoyer: foyer.nomFoyer,
      capaciteFoyer: foyer.capaciteFoyer,
    })
    
    // Find if a university is linked to this foyer
    const linkedUniv = universites.find(u => u.foyer?.idFoyer === foyer.idFoyer)
    setSelectedUniversiteId(linkedUniv?.idUniversite ?? '')
    
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Foyers
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
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Capacité</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foyers.map((foyer) => (
              <TableRow key={foyer.idFoyer ?? foyer.nomFoyer}>
                <TableCell>{foyer.idFoyer}</TableCell>
                <TableCell>{foyer.nomFoyer}</TableCell>
                <TableCell>{foyer.capaciteFoyer}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(foyer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(foyer.idFoyer)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {foyers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun foyer trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Foyer' : 'Ajouter Foyer'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Nom Foyer"
                fullWidth
                required
                value={form.nomFoyer}
                onChange={(e) => setForm({ ...form, nomFoyer: e.target.value })}
              />
              <TextField
                label="Capacité Foyer"
                type="number"
                fullWidth
                required
                value={form.capaciteFoyer}
                onChange={(e) => setForm({ ...form, capaciteFoyer: Number(e.target.value) })}
              />
              <FormControl fullWidth>
                <InputLabel>Université Associée</InputLabel>
                <Select
                  value={selectedUniversiteId}
                  label="Université Associée"
                  onChange={(e) => setSelectedUniversiteId(e.target.value as number)}
                >
                  <MenuItem value="">
                    <em>Aucune</em>
                  </MenuItem>
                  {universites.map((univ) => (
                    <MenuItem key={univ.idUniversite} value={univ.idUniversite}>
                      {univ.nomUniversite}
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
