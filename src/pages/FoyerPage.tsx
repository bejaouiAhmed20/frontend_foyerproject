import { useEffect, useState } from 'react'
import type { FoyerDto, TypeChambre } from '../types/entities'
import { createFoyer, deleteFoyer, getFoyers, updateFoyer } from '../services/api'
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
  blocs: [
    {
      nomBloc: '',
      capaciteBloc: 0,
      chambres: [
        {
          numeroChambre: 0,
          type: 'SIMPLE',
        },
      ],
    },
  ],
}

const chambreTypes: TypeChambre[] = ['SIMPLE', 'DOUBLE', 'TRIPLE']

export default function FoyerPage() {
  const [foyers, setFoyers] = useState<FoyerDto[]>([])
  const [form, setForm] = useState<FoyerDto>(initialFoyer)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadFoyers = async () => {
    try {
      const data = await getFoyers()
      setFoyers(data)
    } catch (error) {
      console.error('Unable to load foyers')
    }
  }

  useEffect(() => {
    loadFoyers()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialFoyer)
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (selectedId) {
        await updateFoyer({ ...form, id: selectedId })
      } else {
        await createFoyer(form)
      }
      await loadFoyers()
      handleClose()
    } catch (error) {
      console.error('Save failed')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteFoyer(id)
      await loadFoyers()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (foyer: FoyerDto) => {
    setSelectedId(foyer.id ?? null)
    setForm({
      nomFoyer: foyer.nomFoyer,
      capaciteFoyer: foyer.capaciteFoyer,
      blocs: [
        {
          nomBloc: foyer.blocs?.[0]?.nomBloc ?? '',
          capaciteBloc: foyer.blocs?.[0]?.capaciteBloc ?? 0,
          chambres: [
            {
              numeroChambre: foyer.blocs?.[0]?.chambres?.[0]?.numeroChambre ?? 0,
              type: foyer.blocs?.[0]?.chambres?.[0]?.type ?? 'SIMPLE',
            },
          ],
        },
      ],
    })
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
              <TableRow key={foyer.id ?? foyer.nomFoyer}>
                <TableCell>{foyer.id}</TableCell>
                <TableCell>{foyer.nomFoyer}</TableCell>
                <TableCell>{foyer.capaciteFoyer}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(foyer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(foyer.id)}>
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

              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Informations du Bloc initial</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Nom Bloc"
                  fullWidth
                  value={form.blocs[0].nomBloc}
                  onChange={(e) => setForm({ ...form, blocs: [{ ...form.blocs[0], nomBloc: e.target.value }] })}
                />
                <TextField
                  label="Capacité Bloc"
                  type="number"
                  fullWidth
                  value={form.blocs[0].capaciteBloc}
                  onChange={(e) => setForm({ ...form, blocs: [{ ...form.blocs[0], capaciteBloc: Number(e.target.value) }] })}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Chambre initiale</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Numéro Chambre"
                  type="number"
                  fullWidth
                  value={form.blocs[0].chambres[0].numeroChambre}
                  onChange={(e) => setForm({ ...form, blocs: [{ ...form.blocs[0], chambres: [{ ...form.blocs[0].chambres[0], numeroChambre: Number(e.target.value) }] }] })}
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={form.blocs[0].chambres[0].type}
                    onChange={(e) => setForm({ ...form, blocs: [{ ...form.blocs[0], chambres: [{ ...form.blocs[0].chambres[0], type: e.target.value as TypeChambre }] }] })}
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
