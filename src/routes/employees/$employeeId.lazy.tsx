import { useQueries, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getAbsences, getConflicts } from 'api'
import { AbsenceType } from 'types'

export const Route = createLazyFileRoute('/employees/$employeeId')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/employees/$employeeId"!</div>
}
