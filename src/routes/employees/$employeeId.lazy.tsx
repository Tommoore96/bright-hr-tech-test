import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getAbsences } from 'api'
import { AbsencesTable } from 'components/absences-table'
import Page from 'components/page'
import PageTitle from 'components/page-title'
import {
  absencesToTableData,
  TABLE_COLUMNS
} from 'utils/absenceTable/absenceTableRows'

// Use loaders?
export const Route = createLazyFileRoute('/employees/$employeeId')({
  component: RouteComponent
})

function RouteComponent() {
  const { employeeId } = Route.useParams()

  const { data, isError, isLoading } = useQuery({
    queryKey: ['absences'],
    queryFn: getAbsences
  })

  // This would be a reusable error component, or handled by a global error boundary/toast etc.
  if (isError) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        Error fetching data
      </div>
    )
  }

  // This would be a reusable loader component
  if (isLoading || !data) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        Loading...
      </div>
    )
  }

  const employeeAbsences = data.filter(
    (absence) => absence.employee.id === employeeId
  )

  const employee = employeeAbsences[0]

  return (
    <Page>
      <PageTitle>
        {employee.employee.firstName} {employee.employee.lastName}
      </PageTitle>
      <AbsencesTable
        tableData={absencesToTableData(
          employeeAbsences,
          undefined,
          `/employees${employeeId}`
        )}
        tableColumns={TABLE_COLUMNS}
      />
    </Page>
  )
}
