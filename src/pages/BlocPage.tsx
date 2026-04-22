import { useEffect, useState } from 'react'
import type { BlocDto, FoyerDto } from '../types/entities'
import { createBloc, deleteBloc, getBlocs, updateBloc, getFoyers, linkBlocFoyer } from '../services/api'
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

const initialBloc: BlocDto = {
  nomBloc: '',
  capaciteBloc: 0,
}

export default function BlocPage() {
  const [blocs, setBlocs] = useState<BlocDto[]>([])
  const [foyers, setFoyers] = useState<FoyerDto[]>([])
  const [form, setForm] = useState<BlocDto>(initialBloc)
  const [selectedFoyerId, setSelectedFoyerId] = useState<number | ''>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadData = async () => {
    try {
      const [blocsData, foyersData] = await Promise.all([getBlocs(), getFoyers()])
      setBlocs(blocsData)
      setFoyers(foyersData)
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
    setForm(initialBloc)
    setSelectedId(null)
    setSelectedFoyerId('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      // Remove any potentially invalid nested objects
      const payload = { ...form }
      delete payload.foyer
      delete payload.chambres
      
      let savedBloc: BlocDto;
      if (selectedId) {
        savedBloc = await updateBloc({ ...payload, idBloc: selectedId })
      } else {
        savedBloc = await createBloc(payload)
      }
      
      const blocId = savedBloc?.idBloc || selectedId;
      if (blocId && selectedFoyerId !== '') {
        await linkBlocFoyer(blocId, selectedFoyerId)
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
      await deleteBloc(id)
      await loadData()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (bloc: BlocDto) => {
    setSelectedId(bloc.idBloc ?? null)
    setForm({
      nomBloc: bloc.nomBloc,
      capaciteBloc: bloc.capaciteBloc,
    })
    
    setSelectedFoyerId(bloc.foyer?.idFoyer ?? '')
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Blocs
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
            {blocs.map((bloc) => (
              <TableRow key={bloc.idBloc ?? bloc.nomBloc}>
                <TableCell>{bloc.idBloc}</TableCell>
                <TableCell>{bloc.nomBloc}</TableCell>
                <TableCell>{bloc.capaciteBloc}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(bloc)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(bloc.idBloc)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {blocs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun bloc trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Bloc' : 'Ajouter Bloc'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Nom Bloc"
                fullWidth
                required
                value={form.nomBloc}
                onChange={(e) => setForm({ ...form, nomBloc: e.target.value })}
              />
              <TextField
                label="Capacité Bloc"
                type="number"
                fullWidth
                required
                value={form.capaciteBloc}
                onChange={(e) => setForm({ ...form, capaciteBloc: Number(e.target.value) })}
              />

              <FormControl fullWidth>
                <InputLabel>Foyer</InputLabel>
                <Select
                  value={selectedFoyerId}
                  label="Foyer"
                  onChange={(e) => setSelectedFoyerId(e.target.value as number)}
                >
                  <MenuItem value="">
                    <em>Aucun</em>
                  </MenuItem>
                  {foyers.map((foyer) => (
                    <MenuItem key={foyer.idFoyer} value={foyer.idFoyer}>
                      {foyer.nomFoyer} (Capacité: {foyer.capaciteFoyer})
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
