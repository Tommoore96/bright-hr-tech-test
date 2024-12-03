import { QueriesOptions, useQueries, useQuery } from '@tanstack/react-query'
import { getAbsences, getConflicts } from 'api'
import { useState } from 'react'
import { AbsenceRecords } from 'types'
import { cn } from 'utils'

const TABLE_COLUMNS = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Type', field: 'type' },
  { headerName: 'Start Date', field: 'startDate' },
  { headerName: 'Days', field: 'days' }
]

const absenceTypeMap = {
  SICKNESS: 'Sickness',
  ANNUAL_LEAVE: 'Annual Leave',
  MEDICAL: 'Medical'
}

export function AbsencesTable({ className }: { className: string }) {
  const absenceQuery = useQuery({
    queryKey: ['absences'],
    queryFn: getAbsences
  })

  const conflicts = useQueries({
    queries: absenceQuery.data
      ? absenceQuery.data.map((absence) => ({
          queryKey: ['conflicts', absence.id],
          queryFn: () => getConflicts(absence.id)
        }))
      : []
  })

  if (absenceQuery.isError || absenceQuery.data === undefined) {
    return <div>Error fetching data</div>
  }

  if (absenceQuery.isLoading) {
    return <div>Loading...</div>
  }

  const tableData = absenceQuery.data.map((absence) => ({
    id: absence.id,
    name: `${absence.employee.firstName} ${absence.employee.lastName}`,
    type: absenceTypeMap[absence.absenceType],
    startDate: new Date(absence.startDate).toLocaleDateString('en-GB'),
    days: absence.days,
    conflicts: conflicts.find((conflict) => conflict.data.id === absence.id)
      ?.data
  }))

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="h-screen">
        <table className="w-full rounded-lg border-2 text-left">
          <thead className="bg-gray-50 uppercase text-gray-700">
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th key={column.field} className="px-4 py-2 md:px-6 md:py-3">
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((absence) => (
              <tr key={absence.id} className="border-b">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 md:px-6 md:py-4">
                  {absence.name}
                </th>
                <td className="px-4 py-3 md:px-6 md:py-4">{absence.type}</td>
                <td className="px-4 py-3 md:px-6 md:py-4">
                  {absence.startDate}
                </td>
                <td className="px-4 py-3 md:px-6 md:py-4">
                  {absence.startDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function sortTableData(
  data: any[],
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null
) {
  if (!sortConfig) return data

  return [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })
}
