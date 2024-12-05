import { useQueries, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getAbsences, getConflicts } from 'api'
import { AbsencesTable } from 'components/absences-table'
import Page from 'components/page'
import PageTitle from 'components/page-title'
import {
  absencesToTableRows,
  TABLE_COLUMNS,
  TableColumnFields
} from 'utils/absenceTable/absenceTableRows'

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

  // This would be a reusable error component, or handled by a global error boundary/toast etc.
  if (absenceQuery.isError) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        Error fetching data
      </div>
    )
  }

  // This would be a reusable loader component
  if (absenceQuery.isLoading || !absenceQuery.data) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        Loading...
      </div>
    )
  }

  const conflictsError =
    conflicts.some((conflict) => conflict.isError) ||
    conflicts?.length !== absenceQuery.data.length

  return (
    <Page>
      <PageTitle>Absences</PageTitle>
      {conflictsError && (
        <div className="flex justify-center rounded-md bg-yellow-100 p-4">
          There was an error fetching all conflict data.
        </div>
      )}
      <AbsencesTable<TableColumnFields>
        tableColumns={TABLE_COLUMNS}
        tableData={absencesToTableRows(
          absenceQuery.data,
          conflictsError
            ? undefined
            : conflicts.map((conflict) => conflict.data)
        )}
        defaultSort={{ key: TableColumnFields.name, direction: 'asc' }}
      />
    </Page>
  )
}
