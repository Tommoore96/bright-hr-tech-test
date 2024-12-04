import { useState } from 'react'
import { cn } from 'utils'

export type TableData<T extends string> = {
  id: string | number
  data: {
    column: T
    element: React.ReactNode
    value: string | number | Date | boolean | null
    sortable?: boolean
  }[]
}[]

export type TableColumn<T extends string> = {
  headerName: string
  field: T
  sortable?: boolean
}

export const AbsencesTable = <T extends string>({
  className,
  tableData,
  tableColumns
}: {
  className?: string
  tableData: TableData<T>
  tableColumns: TableColumn<T>[]
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: T
    direction: 'asc' | 'desc'
  } | null>(null)

  const sortedData = [...tableData].flat().sort((a, b) => {
    if (sortConfig === null) return 0

    const aValue = a.data.find((d) => d.column === sortConfig.key)?.value
    const bValue = b.data.find((d) => d.column === sortConfig.key)?.value

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

  const requestSort = (key: T) => {
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
            {tableColumns.map((column) => {
              const isSortable = !!column.sortable
              return (
                <th
                  key={column.field}
                  className={cn('px-4 py-2 md:px-6 md:py-3 select-none', {
                    'cursor-pointer': isSortable
                  })}
                  {...(isSortable
                    ? { onClick: () => requestSort(column.field) }
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
          {sortedData.map((row) => (
            <tr key={row.id} className="border-b">
              {row.data.map((cell, index) => (
                <td
                  key={cell.column}
                  className={cn('px-4 py-3 md:px-6 md:py-4', {
                    'whitespace-nowrap font-medium text-gray-900': index === 0
                  })}
                >
                  {cell.element}
                </td>
              ))}
            </tr>
          ))}
          {/* {sortedData.map((absence) => (
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
          ))} */}
        </tbody>
      </table>
    </div>
  )
}
