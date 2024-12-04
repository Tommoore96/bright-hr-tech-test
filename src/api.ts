import { AbsenceRecords, Conflict } from './types'

export async function getAbsences(): Promise<AbsenceRecords> {
  // Search params don't work
  const response = await fetch(
    'https://front-end-kata.brighthr.workers.dev/api/absences'
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data
}

export async function getConflicts(id: number): Promise<Conflict> {
  const response = await fetch(
    `https://front-end-kata.brighthr.workers.dev/api/conflict/${id}`
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data
}
