import { useQueries, useQuery } from '@tanstack/react-query'
import { getAbsences, getConflicts } from 'api'
import { useState } from 'react'
import { AbsenceType } from 'types'
import { cn } from 'utils'

const sortKeys = ['name', 'type', 'startDate', 'days'] as const

type SortKey = (typeof sortKeys)[number]

const TABLE_COLUMNS = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Type', field: 'type' },
  { headerName: 'Approved', field: 'approved' },
  { headerName: 'Start Date', field: 'startDate' },
  { headerName: 'End Date', field: 'days' }
] as const

const absenceTypeMap = {
  SICKNESS: 'Sickness',
  ANNUAL_LEAVE: 'Annual Leave',
  MEDICAL: 'Medical'
}

export function AbsencesTable({ className }: { className?: string }) {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey
    direction: 'asc' | 'desc'
  } | null>(null)

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

  const tableData = absenceQuery.data.map((absence, index) => {
    const startDate = new Date(absence.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + absence.days)

    return {
      id: absence.id,
      name: `${absence.employee.firstName} ${absence.employee.lastName}`,
      type: (
        <>
          {getAbsenceEmoji(absence.absenceType)}
          {absenceTypeMap[absence.absenceType]}
        </>
      ),
      approved: absence.approved,
      startDate: startDate.toLocaleDateString('en-GB'),
      days: endDate.toLocaleDateString('en-GB'),
      conflicts: conflicts[index].data?.conflicts
    }
  })

  const sortedData = [...tableData]
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className={cn('overflow-hidden rounded-lg', className)}>
      <table className="w-full border-collapse border-2 border-slate-100 bg-white text-left">
        <thead className="bg-slate-100 text-gray-700">
          <tr>
            {TABLE_COLUMNS.map((column) => {
              const isSortable = checkIsSortable(column.field)
              return (
                <th
                  key={column.field}
                  className={cn('px-4 py-2 md:px-6 md:py-3 select-none', {
                    'cursor-pointer': isSortable
                  })}
                  {...(isSortable
                    ? { onClick: () => requestSort(column.field as SortKey) }
                    : null)}
                >
                  {column.headerName}
                  {isSortable && (
                    <span className="ml-2 inline-block w-4">
                      {sortConfig?.key === column.field ? (
                        sortConfig.direction === 'asc' ? (
                          <span>&uarr;</span>
                        ) : (
                          <span>&darr;</span>
                        )
                      ) : (
                        <span>&uarr;&darr;</span>
                      )}
                    </span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="text-sm">
          {sortedData.map((absence) => (
            <tr
              key={absence.id}
              className={cn('border-b', { 'bg-gray-300': absence.conflicts })}
            >
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 md:px-6 md:py-4">
                {absence.name}
              </th>
              <td className="px-4 py-3 font-light md:px-6 md:py-4">
                {absence.type}
              </td>
              <td className="px-4 py-3 font-light md:px-6 md:py-4">
                {absence.approved ? 'Yes' : 'No'}
              </td>
              <td className="px-4 py-3 font-light md:px-6 md:py-4">
                {absence.startDate}
              </td>
              <td className="px-4 py-3 font-light md:px-6 md:py-4">
                {absence.days}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getAbsenceEmoji(type: AbsenceType) {
  switch (type) {
    case 'SICKNESS':
      return (
        <span role="img" aria-label="ill person" className="mr-2">
          🤒
        </span>
      )
    case 'ANNUAL_LEAVE':
      return (
        <span role="img" aria-label="beach" className="mr-2">
          🏖️
        </span>
      )
    case 'MEDICAL':
      return (
        <span role="img" aria-label="hospital" className="mr-2">
          🏥
        </span>
      )
    default:
      return ''
  }
}

function checkIsSortable(key: string): key is SortKey {
  return sortKeys.includes(key as SortKey)
}
