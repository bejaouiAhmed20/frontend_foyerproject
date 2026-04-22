export type TypeChambre = 'SIMPLE' | 'DOUBLE' | 'TRIPLE'

export interface ChambreDto {
  idChambre?: number
  numeroChambre: number
  type: TypeChambre
  bloc?: BlocDto
}

export interface BlocDto {
  idBloc?: number
  nomBloc: string
  capaciteBloc: number
  chambres?: ChambreDto[]
  foyer?: FoyerDto
}

export interface FoyerDto {
  idFoyer?: number
  nomFoyer: string
  capaciteFoyer: number
  blocs?: BlocDto[]
}

export interface UniversiteDto {
  idUniversite?: number
  nomUniversite: string
  adresse: string
  foyer?: FoyerDto
}

export interface EtudiantDto {
  idEtudiant?: number
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

export interface ReservationPayloadDto {
  idReservation?: string
  anneeUniversitaire: string
  estValide: boolean
  chambreId: number
  etudiantIds: number[]
}
