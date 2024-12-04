import { Link } from '@tanstack/react-router'
import { TableColumn, TableData } from 'components/absences-table'
import { AbsenceRecord, AbsenceType, Conflict } from 'types'

export enum TableColumnFields {
  name = 'name',
  type = 'type',
  approved = 'approved',
  startDate = 'startDate',
  endDate = 'endDate'
}

const absenceTypeMap = {
  SICKNESS: 'Sickness',
  ANNUAL_LEAVE: 'Annual Leave',
  MEDICAL: 'Medical'
}

export const TABLE_COLUMNS: Array<TableColumn<TableColumnFields>> = [
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

export function absencesToTableData(
  absences: AbsenceRecord[],
  conflicts?: Conflict[],
  /**
   * Disable the link if already on that path, there might be a better way to do this than use an argument
   */
  currentPath?: string
): TableData<TableColumnFields> {
  return absences.map((absence, index) => {
    const startDate = new Date(absence.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + absence.days)

    /**
     * Doing this again I would turn the data array into an object to ensure better type safety
     */
    return {
      id: absence.id,
      data: [
        {
          column: TableColumnFields.name,
          element: (
            <Link
              to={`/employees/$employeeId`}
              params={{ employeeId: absence.employee.id }}
              disabled={currentPath === `/employees/${absence.employee.id}`}
            >
              {absence.employee.firstName} {absence.employee.lastName}{' '}
              {!!conflicts && conflicts[index]?.conflicts ? (
                <span
                  aria-label="Conflict"
                  title="Conflict"
                  className="cursor-help select-none"
                >
                  ⚠️
                </span>
              ) : null}
            </Link>
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
