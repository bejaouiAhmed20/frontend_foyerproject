import { useEffect, useState } from 'react'
import type { TypeChambre, UniversiteDto } from '../types/entities'
import { createUniversite, deleteUniversite, getUniversites, updateUniversite } from '../services/api'
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

const initialUniversite: UniversiteDto = {
  nomUniversite: '',
  adresse: '',
  foyer: {
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
  },
}

const chambreTypes: TypeChambre[] = ['SIMPLE', 'DOUBLE', 'TRIPLE']

export default function UniversitePage() {
  const [universites, setUniversites] = useState<UniversiteDto[]>([])
  const [form, setForm] = useState<UniversiteDto>(initialUniversite)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const loadUniversites = async () => {
    try {
      const data = await getUniversites()
      setUniversites(data)
    } catch (error) {
      console.error('Unable to load universites')
    }
  }

  useEffect(() => {
    loadUniversites()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(initialUniversite)
    setSelectedId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (selectedId) {
        await updateUniversite({ ...form, id: selectedId })
      } else {
        await createUniversite(form)
      }
      await loadUniversites()
      handleClose()
    } catch (error) {
      console.error('Failed to save')
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      await deleteUniversite(id)
      await loadUniversites()
    } catch (error) {
      console.error('Delete failed')
    }
  }

  const handleEdit = (universite: UniversiteDto) => {
    setSelectedId(universite.id ?? null)
    setForm({
      nomUniversite: universite.nomUniversite,
      adresse: universite.adresse,
      foyer: {
        nomFoyer: universite.foyer?.nomFoyer ?? '',
        capaciteFoyer: universite.foyer?.capaciteFoyer ?? 0,
        blocs: [
          {
            nomBloc: universite.foyer?.blocs?.[0]?.nomBloc ?? '',
            capaciteBloc: universite.foyer?.blocs?.[0]?.capaciteBloc ?? 0,
            chambres: [
              {
                numeroChambre: universite.foyer?.blocs?.[0]?.chambres?.[0]?.numeroChambre ?? 0,
                type: universite.foyer?.blocs?.[0]?.chambres?.[0]?.type ?? 'SIMPLE',
              },
            ],
          },
        ],
      },
    })
    handleOpen()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Universités
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
              <TableCell><strong>Adresse</strong></TableCell>
              <TableCell><strong>Foyer Lié</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {universites.map((univ) => (
              <TableRow key={univ.id ?? univ.nomUniversite}>
                <TableCell>{univ.id}</TableCell>
                <TableCell>{univ.nomUniversite}</TableCell>
                <TableCell>{univ.adresse}</TableCell>
                <TableCell>{univ.foyer?.nomFoyer ?? 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(univ)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(univ.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {universites.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucune université trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedId ? 'Modifier Université' : 'Ajouter Université'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Nom Université"
                fullWidth
                required
                value={form.nomUniversite}
                onChange={(e) => setForm({ ...form, nomUniversite: e.target.value })}
              />
              <TextField
                label="Adresse"
                fullWidth
                required
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />
              
              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Informations du Foyer (Optionnel)</Typography>
              <TextField
                label="Nom Foyer"
                fullWidth
                value={form.foyer.nomFoyer}
                onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, nomFoyer: e.target.value } })}
              />
              <TextField
                label="Capacité Foyer"
                type="number"
                fullWidth
                value={form.foyer.capaciteFoyer}
                onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, capaciteFoyer: Number(e.target.value) } })}
              />

              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Informations du Bloc initial</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Nom Bloc"
                  fullWidth
                  value={form.foyer.blocs[0].nomBloc}
                  onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, blocs: [{ ...form.foyer.blocs[0], nomBloc: e.target.value }] } })}
                />
                <TextField
                  label="Capacité Bloc"
                  type="number"
                  fullWidth
                  value={form.foyer.blocs[0].capaciteBloc}
                  onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, blocs: [{ ...form.foyer.blocs[0], capaciteBloc: Number(e.target.value) }] } })}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>Chambre initiale</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Numéro Chambre"
                  type="number"
                  fullWidth
                  value={form.foyer.blocs[0].chambres[0].numeroChambre}
                  onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, blocs: [{ ...form.foyer.blocs[0], chambres: [{ ...form.foyer.blocs[0].chambres[0], numeroChambre: Number(e.target.value) }] }] } })}
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={form.foyer.blocs[0].chambres[0].type}
                    onChange={(e) => setForm({ ...form, foyer: { ...form.foyer, blocs: [{ ...form.foyer.blocs[0], chambres: [{ ...form.foyer.blocs[0].chambres[0], type: e.target.value as TypeChambre }] }] } })}
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
