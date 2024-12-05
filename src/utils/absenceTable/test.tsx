import { describe, it, expect } from 'vitest'
import { absencesToTableData, TABLE_COLUMNS } from './absenceTableRows'
import { AbsenceRecord, Conflict } from 'types'
// import { render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { RouterWrapper, TestRouter } from 'test-utils'

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
  it('returns the correct structure', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result).toHaveLength(2)
    expect(result[0].data).toHaveLength(TABLE_COLUMNS.length)
  })

  it.only('handles conflicts correctly', () => {
    render(
      // <>
      //   {absencesToTableData(mockAbsences, mockConflicts).map((row) =>
      //     row.data.map((cell) => cell.element)
      //   )}
      // </>
      <div>Hello</div>,
      { wrapper: RouterWrapper }
    )

    screen.debug()
    // expect(result[0].data[0].element.props.children[2].props.title).toBe(
    //   'Conflict'
    // )
    // expect(result[1].data[0].element.props.children[2]).toBeUndefined()
  })

  it('handles currentPath parameter correctly', () => {
    const result = absencesToTableData(mockAbsences, undefined, '/employees/1')
    expect(result[0].data[0].element.props.disabled).toBe(true)
    expect(result[1].data[0].element.props.disabled).toBe(false)
  })

  it('formats dates correctly', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result[0].data[3].element).toBe('01/01/2023')
    expect(result[0].data[4].element).toBe('03/01/2023')
    expect(result[1].data[3].element).toBe('05/01/2023')
    expect(result[1].data[4].element).toBe('09/01/2023')
  })

  it('maps absence types correctly', () => {
    const result = absencesToTableData(mockAbsences)
    expect(result[0].data[1].element.props.children[1]).toBe('Sickness')
    expect(result[1].data[1].element.props.children[1]).toBe('Annual Leave')
  })
})
