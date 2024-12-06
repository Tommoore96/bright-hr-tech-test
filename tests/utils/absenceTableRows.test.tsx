import { describe, expect } from 'vitest'
import {
  absencesToTableRows,
  TABLE_COLUMNS
} from '../../src/utils/absenceTable/absenceTableRows'
import { AbsenceRecord, Conflict, TableColumnFields } from 'types'
import { screen } from '@testing-library/react'
import { customRender } from '../utils'
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
    startDate: new Date('2024-01-02'),
    days: 5,
    approved: false
  }
]

const mockConflicts: Conflict[] = [{ conflicts: true }, { conflicts: false }]

describe('absencesToTableData', () => {
  test('returns the correct amount of rows', () => {
    const result = absencesToTableRows(mockAbsences)
    expect(result).toHaveLength(2)
    expect(result[0].data).toHaveLength(TABLE_COLUMNS.length)
  })

  test('handles conflicts correctly', () => {
    customRender(
      <>
        {absencesToTableRows(mockAbsences, mockConflicts).map((row) =>
          row.data.map((cell) => cell.element)
        )}
      </>
    )

    const conflictIcon = screen.getByText('⚠️')

    expect(conflictIcon.parentElement).toContainHTML('John Doe')
  })

  test('handles currentPath parameter correctly', () => {
    const result = absencesToTableRows(
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
    const nameCell2 = result[1].data.find(
      (cell) => cell.column === TableColumnFields.name
    )

    assert(
      React.isValidElement(nameCell2?.element) && nameCell2.element.props,
      'The second nameCell is undefined'
    )

    expect(nameCell2?.element.props.disabled).toBe(false)
  })

  test('formats dates correctly', () => {
    // Start date
    const result = absencesToTableRows(mockAbsences)
    const startDateCell = result[0].data.find(
      (row) => row.column === TableColumnFields.startDate
    )

    const startDateCell2 = result[1].data.find(
      (row) => row.column === TableColumnFields.startDate
    )

    assert(startDateCell, 'startDateCell is undefined')
    assert(startDateCell2, 'startDateCell2 is undefined')

    expect(startDateCell.element).toBe('01/01/2024')
    expect(startDateCell2.element).toBe('02/01/2024')

    // End date
    const endDateCell = result[0].data.find(
      (row) => row.column === TableColumnFields.endDate
    )

    const endDateCell2 = result[1].data.find(
      (row) => row.column === TableColumnFields.endDate
    )

    assert(endDateCell, 'endDateCell is undefined')
    assert(endDateCell2, 'endDateCell2 is undefined')

    expect(endDateCell.element).toBe('04/01/2024')
    expect(endDateCell2.element).toBe('07/01/2024')
  })
})
