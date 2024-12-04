import { useQueries, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getAbsences, getConflicts } from 'api'
import {
  AbsencesTable,
  TableColumn,
  TableData
} from 'components/absences-table'
import { AbsenceType } from 'types'

const absenceTypeMap = {
  SICKNESS: 'Sickness',
  ANNUAL_LEAVE: 'Annual Leave',
  MEDICAL: 'Medical'
}

enum TableColumnFields {
  name = 'name',
  type = 'type',
  approved = 'approved',
  startDate = 'startDate',
  endDate = 'endDate'
}

const TABLE_COLUMNS: Array<TableColumn<TableColumnFields>> = [
  { headerName: 'Name', field: TableColumnFields.name, sortable: true },
  { headerName: 'Type', field: TableColumnFields.type, sortable: true },
  { headerName: 'Approved', field: TableColumnFields.approved },
  {
    headerName: 'Start Date',
    field: TableColumnFields.startDate,
    sortable: true
  },
  { headerName: 'End Date', field: TableColumnFields.endDate, sortable: true }
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
    // React query returns data in order requested, so I can safely use the index to get the conflicts
    absenceQuery.data.map((absence, index) => {
      const startDate = new Date(absence.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + absence.days)

      /**
       * Doing this again I would turn the data into an object to ensure better type safety
       */
      return {
        id: absence.id,
        data: [
          {
            column: TableColumnFields.name,
            element: (
              <>
                {absence.employee.firstName} {absence.employee.lastName}{' '}
                {conflicts[index].data?.conflicts ? (
                  <span aria-label="Conflict" title="Conflict">
                    ⚠️
                  </span>
                ) : null}
              </>
            ),
            value: `${absence.employee.firstName} ${absence.employee.lastName}`
          },
          {
            column: TableColumnFields.type,
            element: (
              <>
                {getAbsenceEmoji(absence.absenceType)}
                {absenceTypeMap[absence.absenceType]}
              </>
            ),
            value: absence.absenceType
          },
          {
            column: TableColumnFields.approved,
            element: absence.approved ? 'Yes' : 'No',
            value: absence.approved
          },
          {
            column: TableColumnFields.startDate,
            type: 'date',
            element: startDate.toLocaleDateString('en-GB'),
            value: startDate
          },
          {
            column: TableColumnFields.endDate,
            type: 'date',
            element: endDate.toLocaleDateString('en-GB'),
            value: endDate
          }
        ]
      }
    })

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden px-3 pb-12 pt-6 align-middle sm:px-7 md:gap-8 md:px-12 md:pt-8 lg:mx-auto lg:max-w-4xl">
      <h1 className="text-4xl font-bold">Absences</h1>
      <AbsencesTable<TableColumnFields>
        tableColumns={TABLE_COLUMNS}
        tableData={tableData}
      />
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
