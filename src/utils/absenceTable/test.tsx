import { describe, expect } from 'vitest'
import {
  absencesToTableData,
  TABLE_COLUMNS,
  TableColumnFields
} from './absenceTableRows'
import { AbsenceRecord, Conflict } from 'types'
// import { render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { routerRender, RouterWrapper, TestRouter } from 'test-utils'
import React from 'react'

const mockAbsences: AbsenceRecord[] = [
  {
    id: 1,
    employee: { id: '1', firstName: 'John', lastName: 'Doe' },
    absenceType: 'SICKNESS',
    startDate: new Date('2024-01-01'),
    days: 3,
    approved: true
  },
  {
    id: 2,
    employee: { id: '2', firstName: 'Jane', lastName: 'Smith' },
    absenceType: 'ANNUAL_LEAVE',
    startDate: new Date('2024-01-01'),
    days: 5,
    approved: false
  }
]

const mockConflicts: Conflict[] = [{ conflicts: true }, { conflicts: false }]

describe('absencesToTableData', () => {
  test('returns the correct structure', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result).toHaveLength(2)
    expect(result[0].data).toHaveLength(TABLE_COLUMNS.length)
  })

  test('handles conflicts correctly', () => {
    routerRender(
      <>
        {absencesToTableData(mockAbsences, mockConflicts).map((row) =>
          row.data.map((cell) => cell.element)
        )}
      </>
    )

    const conflictIcon = screen.getByText('⚠️')

    expect(conflictIcon.parentElement).toContainHTML('John Doe')
  })

  test.only('handles currentPath parameter correctly', () => {
    const result = absencesToTableData(
      mockAbsences,
      mockConflicts,
      '/employees/1'
    )

    const nameCell = result[0].data.find(
      (cell) => cell.column === TableColumnFields.name
    )

    assert(
      React.isValidElement(nameCell?.element) && nameCell.element.props,
      'nameCell is undefined'
    )

    // Check the first employee link is disabled
    expect(nameCell?.element.props.disabled).toBe(true)

    // Check the second employee link is not disabled
    const result2 = absencesToTableData(
      mockAbsences,
      mockConflicts,
      '/employees/2'
    )

    const nameCell2 = result2[0].data.find(
      (cell) => cell.column === TableColumnFields.name
    )

    assert(
      React.isValidElement(nameCell2?.element) && nameCell2.element.props,
      'nameCell is undefined'
    )

    expect(nameCell2?.element.props.disabled).toBe(false)
  })

  test('formats dates correctly', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result[0].data[3].element).toBe('01/01/2024')
    expect(result[0].data[4].element).toBe('03/01/2024')
    expect(result[1].data[3].element).toBe('05/01/2024')
    expect(result[1].data[4].element).toBe('09/01/2024')
  })

  test('maps absence types correctly', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result[0].data[1].element.props.children[1]).toBe('Sickness')
    expect(result[1].data[1].element.props.children[1]).toBe('Annual Leave')
  })
})

function TestWrapper({
  data
}: {
  data: ReturnType<typeof absencesToTableData>
}) {
  return (
    <>
      {data.map((row) => (
        <div key={row.id}>
          {row.data.map((cell, index) => (
            <div key={index}>{cell.element}</div>
          ))}
        </div>
      ))}
    </>
  )
}
