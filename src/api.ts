import { AbsenceRecords } from './types'

export function getAbsences(): Promise<AbsenceRecords> {
  return fetch('https://front-end-kata.brighthr.workers.dev/api/absences').then(
    (res) => res.json()
  )
}

export function getConflicts(id: number): Promise<{ conflicts: boolean }> {
  return fetch(
    `https://front-end-kata.brighthr.workers.dev/api/conflict/${id}`
  ).then((res) => res.json())
}
