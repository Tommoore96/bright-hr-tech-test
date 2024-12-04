import { useQueries, useQuery } from '@tanstack/react-query'
import { getAbsences, getConflicts } from 'api'
import { useState } from 'react'
import { AbsenceType } from 'types'
import { cn } from 'utils'

interface Column<T> {
  headerName: string
  field: keyof T
  sortable?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
}

interface SortConfig<T> {
  key: keyof T
  direction: 'ascending' | 'descending'
}

const TABLE_COLUMNS = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Type', field: 'type' },
  { headerName: 'Approved', field: 'approved' },
  { headerName: 'Start Date', field: 'startDate' },
  { headerName: 'End Date', field: 'endDate' }
] as const

const Table = <T,>({ columns, data, className }: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null)

  const sortedData = [...tableData].flat().sort((a, b) => {
    if (sortConfig === null) return 0

    const aValue = a.data.find((d) => d.column === sortConfig.key).value
    const bValue = b.data.find((d) => d.column === sortConfig.key).value

    if (aValue === undefined || bValue === undefined) return 0

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    return 0
  })

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

// function checkIsSortable(key: string): key is SortKey {
//   return sortKeys.includes(key as SortKey)
// }
