import type {
  BlocDto,
  ChambreDto,
  EtudiantDto,
  FoyerDto,
  ReservationDto,
  UniversiteDto,
} from '../types/entities'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${message}`)
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as unknown as T
  }

  return response.json()
}

const wrapDelete = async (path: string) => {
  const response = await fetch(`${API_BASE}${path}`, { method: 'DELETE' })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${message}`)
  }
}

export const getUniversites = () => fetchJson<UniversiteDto[]>('/universite')
export const getUniversiteById = (id: number | string) => fetchJson<UniversiteDto>(`/universite/${id}`)
export const createUniversite = (universite: UniversiteDto) =>
  fetchJson<UniversiteDto>('/universite', {
    method: 'POST',
    body: JSON.stringify(universite),
  })
export const updateUniversite = (universite: UniversiteDto) =>
  fetchJson<UniversiteDto>('/universite', {
    method: 'PUT',
    body: JSON.stringify(universite),
  })
export const deleteUniversite = (id: number | string) => wrapDelete(`/universite/${id}`)

export const getFoyers = () => fetchJson<FoyerDto[]>('/foyer')
export const getFoyerById = (id: number | string) => fetchJson<FoyerDto>(`/foyer/${id}`)
export const createFoyer = (foyer: FoyerDto) =>
  fetchJson<FoyerDto>('/foyer', { method: 'POST', body: JSON.stringify(foyer) })
export const updateFoyer = (foyer: FoyerDto) =>
  fetchJson<FoyerDto>('/foyer', { method: 'PUT', body: JSON.stringify(foyer) })
export const deleteFoyer = (id: number | string) => wrapDelete(`/foyer/${id}`)
export const linkFoyerUniversite = (foyerId: number | string, universiteId: number | string) =>
  fetchJson<FoyerDto>(`/foyer/${foyerId}/universite/${universiteId}`, { method: 'PUT' })

export const getBlocs = () => fetchJson<BlocDto[]>('/bloc')
export const getBlocById = (id: number | string) => fetchJson<BlocDto>(`/bloc/${id}`)
export const createBloc = (bloc: BlocDto) =>
  fetchJson<BlocDto>('/bloc', { method: 'POST', body: JSON.stringify(bloc) })
export const updateBloc = (bloc: BlocDto) =>
  fetchJson<BlocDto>('/bloc', { method: 'PUT', body: JSON.stringify(bloc) })
export const deleteBloc = (id: number | string) => wrapDelete(`/bloc/${id}`)

export const getChambres = () => fetchJson<ChambreDto[]>('/chambre')
export const getChambreById = (id: number | string) => fetchJson<ChambreDto>(`/chambre/${id}`)
export const createChambre = (chambre: ChambreDto) =>
  fetchJson<ChambreDto>('/chambre', { method: 'POST', body: JSON.stringify(chambre) })
export const updateChambre = (chambre: ChambreDto) =>
  fetchJson<ChambreDto>('/chambre', { method: 'PUT', body: JSON.stringify(chambre) })
export const deleteChambre = (id: number | string) => wrapDelete(`/chambre/${id}`)
export const getChambreCapacity = (id: number | string) => fetchJson<number>(`/chambre/${id}/capacity`)

export const getEtudiants = () => fetchJson<EtudiantDto[]>('/etudiant')
export const getEtudiantById = (id: number | string) => fetchJson<EtudiantDto>(`/etudiant/${id}`)
export const createEtudiant = (etudiant: EtudiantDto) =>
  fetchJson<EtudiantDto>('/etudiant', { method: 'POST', body: JSON.stringify(etudiant) })
export const updateEtudiant = (etudiant: EtudiantDto) =>
  fetchJson<EtudiantDto>('/etudiant', { method: 'PUT', body: JSON.stringify(etudiant) })
export const deleteEtudiant = (id: number | string) => wrapDelete(`/etudiant/${id}`)
export const getEtudiantReservations = (id: number | string) => fetchJson<ReservationDto[]>(`/etudiant/${id}/reservations`)

export const getReservations = () => fetchJson<ReservationDto[]>('/reservation')
export const getReservationById = (id: number | string) => fetchJson<ReservationDto>(`/reservation/${id}`)
export const createReservation = (reservation: ReservationDto) =>
  fetchJson<ReservationDto>('/reservation', { method: 'POST', body: JSON.stringify(reservation) })
export const updateReservation = (reservation: ReservationDto) =>
  fetchJson<ReservationDto>('/reservation', { method: 'PUT', body: JSON.stringify(reservation) })
export const deleteReservation = (id: string) => wrapDelete(`/reservation/${id}`)
export const checkReservationAvailability = (chambreId: number | string) => fetchJson<boolean>(`/reservation/availability/${chambreId}`)
export const validateReservation = (id: string) => fetchJson<ReservationDto>(`/reservation/${id}/validate`, { method: 'PUT' })
export const cancelReservation = (id: string) => fetchJson<ReservationDto>(`/reservation/${id}/cancel`, { method: 'PUT' })
