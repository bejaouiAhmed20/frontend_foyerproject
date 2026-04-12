export type TypeChambre = 'SIMPLE' | 'DOUBLE' | 'TRIPLE'

export interface ChambreDto {
  id?: number
  numeroChambre: number
  type: TypeChambre
}

export interface BlocDto {
  id?: number
  nomBloc: string
  capaciteBloc: number
  chambres: ChambreDto[]
}

export interface FoyerDto {
  id?: number
  nomFoyer: string
  capaciteFoyer: number
  blocs: BlocDto[]
}

export interface UniversiteDto {
  id?: number
  nomUniversite: string
  adresse: string
  foyer: FoyerDto
}

export interface EtudiantDto {
  id?: number
  nomEt: string
  prenomEt: string
  cin: number
  ecole: string
  dateNaissance: string
}

export interface ReservationEtudiantRef {
  idEtudiant: number
}

export interface ReservationDto {
  idReservation: string
  anneeUniversitaire: string
  estValide: boolean
  etudiants: ReservationEtudiantRef[]
}
