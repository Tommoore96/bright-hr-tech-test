import { useQueries, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getAbsences, getConflicts } from 'api'
import {
  AbsencesTable,
  TableColumn,
  TableData
} from 'components/absences-table'

const absenceTypeMap = {
  SICKNESS: 'Sickness',
  ANNUAL_LEAVE: 'Annual Leave',
  MEDICAL: 'Medical'
}

enum TableColumnField {
  name = 'name',
  type = 'type',
  approved = 'approved',
  startDate = 'startDate',
  endDate = 'endDate'
}

const TABLE_COLUMNS: Array<
  TableColumn<'name' | 'type' | 'approved' | 'startDate' | 'endDate'>
> = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Type', field: 'type' },
  { headerName: 'Approved', field: 'approved' },
  { headerName: 'Start Date', field: 'startDate' },
  { headerName: 'End Date', field: 'endDate' }
]

export const Route = createLazyFileRoute('/')({
  component: Index
})

function Index() {
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

  const tableData: TableData<(typeof TABLE_COLUMNS)[number]['field']> =
    absenceQuery.data.map((absence) => {
      const startDate = new Date(absence.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + absence.days)

      return {
        id: absence.id,
        data: [
          {
            column: 'name',
            element: `${absence.employee.firstName} ${absence.employee.lastName}`,
            value: `${absence.employee.firstName} ${absence.employee.lastName}`,
            sortable: true
          },
          {
            column: 'type',
            element: (
              <>
                {getAbsenceEmoji(absence.absenceType)}
                {absenceTypeMap[absence.absenceType]}
              </>
            ),
            value: absence.absenceType,
            sortable: true
          },
          {
            column: 'approved',
            element: absence.approved ? 'Yes' : 'No',
            value: absence.approved
          },
          {
            column: 'startDate',
            type: 'date',
            element: startDate.toLocaleDateString('en-GB'),
            value: startDate
          },
          {
            column: 'endDate',
            type: 'date',
            element: endDate.toLocaleDateString('en-GB'),
            value: endDate
          }
          // {
          //   column: 'startDate',
          //   element: conflicts[index].data?.conflicts,
          //   value: conflicts[index].data?.conflicts
          // }
        ]
      }
    })

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden px-3 pb-12 pt-6 align-middle sm:px-7 md:gap-8 md:px-12 md:pt-8 lg:mx-auto lg:max-w-4xl">
      <h1 className="text-4xl font-bold">Absences</h1>
      <AbsencesTable tableColumns={TABLE_COLUMNS} tableData={tableData} />
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
