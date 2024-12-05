import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect } from 'vitest'
import { AbsencesTable, TableData, TableColumn } from './index'

type TestColumns = 'name' | 'date' | 'status'

const tableColumns: TableColumn<TestColumns>[] = [
  { headerName: 'Name', field: 'name', sortable: true },
  { headerName: 'Date', field: 'date', sortable: true },
  { headerName: 'Status', field: 'status', sortable: false }
]

const tableData: TableData<TestColumns> = [
  {
    id: 1,
    data: [
      { column: 'name', element: 'Alice', value: 'Alice' },
      {
        column: 'date',
        element: '2024-01-01',
        value: new Date('2024-01-01')
      },
      { column: 'status', element: 'Present', value: 'Present' }
    ]
  },
  {
    id: 2,
    data: [
      { column: 'name', element: 'Bob', value: 'Bob' },
      {
        column: 'date',
        element: '2024-01-02',
        value: new Date('2024-01-02')
      },
      { column: 'status', element: 'Absent', value: 'Absent' }
    ]
  }
]

describe('AbsencesTable', () => {
  test('renders correctly', () => {
    render(<AbsencesTable tableData={tableData} tableColumns={tableColumns} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  test('sorts data correctly when passed a default', () => {
    const { unmount } = render(
      <AbsencesTable
        tableData={tableData}
        tableColumns={tableColumns}
        defaultSort={{ key: 'name', direction: 'asc' }}
      />
    )

    let rows = screen.getAllByRole('row')

    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Bob')

    unmount()

    render(
      <AbsencesTable
        tableData={tableData}
        tableColumns={tableColumns}
        defaultSort={{ key: 'name', direction: 'desc' }}
      />
    )

    rows = screen.getAllByRole('row')

    expect(rows[1]).toHaveTextContent('Bob')
    expect(rows[2]).toHaveTextContent('Alice')
  })

  test('sorts data correctly when column header is clicked', () => {
    render(
      <AbsencesTable
        tableData={tableData}
        tableColumns={tableColumns}
        defaultSort={{ key: 'name', direction: 'asc' }}
      />
    )

    let rows = screen.getAllByRole('row')

    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Bob')

    const nameHeader = screen.getByText('Name')

    fireEvent.click(nameHeader)

    rows = screen.getAllByRole('row')

    expect(rows[1]).toHaveTextContent('Bob')
    expect(rows[2]).toHaveTextContent('Alice')
  })

  test('non sortable columns do not change table order when clicked', () => {
    render(<AbsencesTable tableData={tableData} tableColumns={tableColumns} />)

    const rows = screen.getAllByRole('row')

    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Bob')

    const statusHeader = screen.getByText('Status')

    fireEvent.click(statusHeader)

    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Bob')
  })

  test('renders column headers correctly', () => {
    render(<AbsencesTable tableData={tableData} tableColumns={tableColumns} />)

    tableColumns.forEach((column) => {
      expect(screen.getByText(column.headerName)).toBeInTheDocument()
    })
  })

  /**
   * I wouldn't normally use snapshots but I can't find a way to find the elements correctly in vitest.
   * I think this is a good method for this test in the meantime anyway.
   */
  test('renders table rows and cells correctly', () => {
    const { asFragment } = render(
      <AbsencesTable tableData={tableData} tableColumns={tableColumns} />
    )
    expect(asFragment).toMatchSnapshot()
  })
})
