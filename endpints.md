# API Endpoints

This document lists all REST endpoints in the project and the expected request body structure for POST/PUT operations.

---

## Universite

Base path: `/universite`

### Create Universite
- Method: `POST`
- URL: `/universite`
- Body:
```json
{
  "nomUniversite": "string",
  "adresse": "string",
  "foyer": {
    "nomFoyer": "string",
    "capaciteFoyer": 0,
    "blocs": [
      {
        "nomBloc": "string",
        "capaciteBloc": 0,
        "chambres": [
          {
            "numeroChambre": 0,
            "type": "SIMPLE"
          }
        ]
      }
    ]
  }
}
```

### Get all Universites
- Method: `GET`
- URL: `/universite`

### Get Universite by ID
- Method: `GET`
- URL: `/universite/{id}`
- Path parameter: `id` (Long)

### Update Universite
- Method: `PUT`
- URL: `/universite`
- Body: same shape as create

### Delete Universite
- Method: `DELETE`
- URL: `/universite/{id}`
- Path parameter: `id` (Long)

---

## Foyer

Base path: `/foyer`

### Create Foyer
- Method: `POST`
- URL: `/foyer`
- Body:
```json
{
  "nomFoyer": "string",
  "capaciteFoyer": 0,
  "blocs": [
    {
      "nomBloc": "string",
      "capaciteBloc": 0,
      "chambres": [
        {
          "numeroChambre": 0,
          "type": "SIMPLE"
        }
      ]
    }
  ]
}
```

### Get all Foyers
- Method: `GET`
- URL: `/foyer`

### Get Foyer by ID
- Method: `GET`
- URL: `/foyer/{id}`
- Path parameter: `id` (Long)

### Update Foyer
- Method: `PUT`
- URL: `/foyer`
- Body: same shape as create

### Delete Foyer
- Method: `DELETE`
- URL: `/foyer/{id}`
- Path parameter: `id` (Long)

### Link Foyer with Universite
- Method: `PUT`
- URL: `/foyer/{foyerId}/universite/{universiteId}`
- Path parameters: `foyerId` (Long), `universiteId` (Long)
- Description: Creates the unique one-to-one link between a foyer and a university.

---

## Bloc

Base path: `/bloc`

### Create Bloc
- Method: `POST`
- URL: `/bloc`
- Body:
```json
{
  "nomBloc": "string",
  "capaciteBloc": 0,
  "chambres": [
    {
      "numeroChambre": 0,
      "type": "SIMPLE"
    }
  ]
}
```

### Get all Blocs
- Method: `GET`
- URL: `/bloc`

### Get Bloc by ID
- Method: `GET`
- URL: `/bloc/{id}`
- Path parameter: `id` (Long)

### Update Bloc
- Method: `PUT`
- URL: `/bloc`
- Body: same shape as create

### Delete Bloc
- Method: `DELETE`
- URL: `/bloc/{id}`
- Path parameter: `id` (Long)

---

## Chambre

Base path: `/chambre`

### Create Chambre
- Method: `POST`
- URL: `/chambre`
- Body:
```json
{
  "numeroChambre": 0,
  "type": "SIMPLE",
  "bloc": {
    "idBloc": 1
  }
}
```
- Note: If a bloc is provided, the room will be linked to that block.

### Get all Chambres
- Method: `GET`
- URL: `/chambre`

### Get Chambre by ID
- Method: `GET`
- URL: `/chambre/{id}`
- Path parameter: `id` (Long)

### Get Chambre Capacity
- Method: `GET`
- URL: `/chambre/{id}/capacity`
- Path parameter: `id` (Long)
- Returns the capacity based on typology (`SIMPLE`, `DOUBLE`, `TRIPLE`).

### Update Chambre
- Method: `PUT`
- URL: `/chambre`
- Body: same shape as create

### Delete Chambre
- Method: `DELETE`
- URL: `/chambre/{id}`
- Path parameter: `id` (Long)

---

## Etudiant

Base path: `/etudiant`

### Create Etudiant
- Method: `POST`
- URL: `/etudiant`
- Body:
```json
{
  "nomEt": "string",
  "prenomEt": "string",
  "cin": 0,
  "ecole": "string",
  "dateNaissance": "YYYY-MM-DD"
}
```
- Note: `reservations` is ignored in JSON by the entity mapping.

### Get all Etudiants
- Method: `GET`
- URL: `/etudiant`

### Get Etudiant by ID
- Method: `GET`
- URL: `/etudiant/{id}`
- Path parameter: `id` (Long)

### Update Etudiant
- Method: `PUT`
- URL: `/etudiant`
- Body: same shape as create

### Delete Etudiant
- Method: `DELETE`
- URL: `/etudiant/{id}`
- Path parameter: `id` (Long)

### Get Etudiant Reservation History
- Method: `GET`
- URL: `/etudiant/{id}/reservations`
- Path parameter: `id` (Long)
- Description: Returns the accommodation history linked to the student profile.

---

## Reservation

Base path: `/reservation`

### Create Reservation
- Method: `POST`
- URL: `/reservation`
- Body:
```json
{
  "idReservation": "optional-string",
  "anneeUniversitaire": "YYYY-MM-DD",
  "estValide": true,
  "chambre": {
    "idChambre": 1
  },
  "etudiants": [
    { "idEtudiant": 1 },
    { "idEtudiant": 2 }
  ]
}
```
- Note: The reservation ID is optional; it will be generated automatically if omitted.

### Get all Reservations
- Method: `GET`
- URL: `/reservation`

### Get Reservation by ID
- Method: `GET`
- URL: `/reservation/{id}`
- Path parameter: `id` (String)

### Update Reservation
- Method: `PUT`
- URL: `/reservation`
- Body: same shape as create

### Delete Reservation
- Method: `DELETE`
- URL: `/reservation/{id}`
- Path parameter: `id` (String)

### Check chambre availability
- Method: `GET`
- URL: `/reservation/availability/{chambreId}`
- Path parameter: `chambreId` (Long)
- Returns: `true` if the room is free for a valid reservation, otherwise `false`.

### Validate Reservation
- Method: `PUT`
- URL: `/reservation/{id}/validate`
- Path parameter: `id` (String)
- Description: Validates an existing reservation.

### Cancel Reservation
- Method: `PUT`
- URL: `/reservation/{id}/cancel`
- Path parameter: `id` (String)
- Description: Cancels an existing reservation without deleting it.

---

## Enum values

### `TypeChambre`
- `SIMPLE`
- `DOUBLE`
- `TRIPLE`
