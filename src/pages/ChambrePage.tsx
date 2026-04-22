import { useEffect, useState } from 'react'
import type { ChambreDto, TypeChambre, BlocDto } from '../types/entities'
import { createChambre, deleteChambre, getChambres, updateChambre, getBlocs } from '../services/api'
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

const initialChambre: ChambreDto = {
  numeroChambre: 0,
  type: 'SIMPLE',
  bloc: {
    nomBloc: '',
    capaciteBloc: 0,
    idBloc: 0,
  },
}

const chambreTypes: TypeChambre[] = ['SIMPLE', 'DOUBLE', 'TRIPLE']

export default function ChambrePage() {
  const [chambres, setChambres] = useState<ChambreDto[]>([])
  const [blocs, setBlocs] = useState<BlocDto[]>([])
  const [form, setForm] = useState<ChambreDto>(initialChambre)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadData = async () => {
    try {
      const [chambresData, blocsData] = await Promise.all([getChambres(), getBlocs()])
      setChambres(chambresData)
      setBlocs(blocsData)
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
    setForm(initialChambre)
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (selectedId) {
        await updateChambre({ ...form, idChambre: selectedId })
      } else {
        await createChambre(form)
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
      await deleteChambre(id)
      await loadData()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (chambre: ChambreDto) => {
    setSelectedId(chambre.idChambre ?? null)
    setForm({
      numeroChambre: chambre.numeroChambre,
      type: chambre.type,
      bloc: chambre.bloc ? {
        idBloc: chambre.bloc.idBloc,
        nomBloc: chambre.bloc.nomBloc,
        capaciteBloc: chambre.bloc.capaciteBloc,
      } : undefined,
    })
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Chambres
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
              <TableCell><strong>Numéro</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chambres.map((chambre) => (
              <TableRow key={chambre.idChambre ?? chambre.numeroChambre}>
                <TableCell>{chambre.idChambre}</TableCell>
                <TableCell>{chambre.numeroChambre}</TableCell>
                <TableCell>{chambre.type}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(chambre)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(chambre.idChambre)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {chambres.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucune chambre trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Chambre' : 'Ajouter Chambre'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Numéro Chambre"
                type="number"
                fullWidth
                required
                value={form.numeroChambre}
                onChange={(e) => setForm({ ...form, numeroChambre: Number(e.target.value) })}
              />
              <FormControl fullWidth required>
                <InputLabel>Type Chambre</InputLabel>
                <Select
                  label="Type Chambre"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as TypeChambre })}
                >
                  {chambreTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Bloc</InputLabel>
                <Select
                  value={form.bloc?.idBloc || ''}
                  label="Bloc"
                  onChange={(e) => {
                    const selectedBloc = blocs.find(b => b.idBloc === Number(e.target.value));
                    if (selectedBloc) {
                      setForm({ ...form, bloc: selectedBloc });
                    }
                  }}
                >
                  {blocs.map((bloc) => (
                    <MenuItem key={bloc.idBloc} value={bloc.idBloc}>
                      {bloc.nomBloc} (Capacité: {bloc.capaciteBloc})
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
