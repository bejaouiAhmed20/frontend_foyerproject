import { useEffect, useState } from 'react'
import type { BlocDto, TypeChambre } from '../types/entities'
import { createBloc, deleteBloc, getBlocs, updateBloc } from '../services/api'
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
  chambres: [
    {
      numeroChambre: 0,
      type: 'SIMPLE',
    },
  ],
}

const chambreTypes: TypeChambre[] = ['SIMPLE', 'DOUBLE', 'TRIPLE']

export default function BlocPage() {
  const [blocs, setBlocs] = useState<BlocDto[]>([])
  const [form, setForm] = useState<BlocDto>(initialBloc)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadBlocs = async () => {
    try {
      const data = await getBlocs()
      setBlocs(data)
    } catch (error) {
      console.error('Unable to load blocs')
    }
  }

  useEffect(() => {
    loadBlocs()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialBloc)
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (selectedId) {
        await updateBloc({ ...form, id: selectedId })
      } else {
        await createBloc(form)
      }
      await loadBlocs()
      handleClose()
    } catch (error) {
      console.error('Save failed')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteBloc(id)
      await loadBlocs()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (bloc: BlocDto) => {
    setSelectedId(bloc.id ?? null)
    setForm({
      nomBloc: bloc.nomBloc,
      capaciteBloc: bloc.capaciteBloc,
      chambres: [
        {
          numeroChambre: bloc.chambres?.[0]?.numeroChambre ?? 0,
          type: bloc.chambres?.[0]?.type ?? 'SIMPLE',
        },
      ],
    })
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
              <TableRow key={bloc.id ?? bloc.nomBloc}>
                <TableCell>{bloc.id}</TableCell>
                <TableCell>{bloc.nomBloc}</TableCell>
                <TableCell>{bloc.capaciteBloc}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(bloc)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(bloc.id)}>
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

              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Chambre initiale</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Numéro Chambre"
                  type="number"
                  fullWidth
                  value={form.chambres[0].numeroChambre}
                  onChange={(e) => setForm({ ...form, chambres: [{ ...form.chambres[0], numeroChambre: Number(e.target.value) }] })}
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={form.chambres[0].type}
                    onChange={(e) => setForm({ ...form, chambres: [{ ...form.chambres[0], type: e.target.value as TypeChambre }] })}
                  >
                    {chambreTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
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
