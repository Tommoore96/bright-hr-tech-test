export type Employee = {
  firstName: string
  lastName: string
  id: string
}

export type AbsenceType = 'SICKNESS' | 'ANNUAL_LEAVE' | 'MEDICAL'

export type AbsenceRecord = {
  id: number
  startDate: Date
  days: number
  absenceType: AbsenceType
  employee: Employee
  approved: boolean
}

export type AbsenceRecords = AbsenceRecord[]

export type Conflict = { conflicts: boolean } | undefined

export enum TableColumnFields {
  name = 'name',
  type = 'type',
  approved = 'approved',
  startDate = 'startDate',
  endDate = 'endDate'
}
