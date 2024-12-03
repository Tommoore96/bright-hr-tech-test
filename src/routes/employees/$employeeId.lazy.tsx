import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/employees/$employeeId')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/employees/$employeeId"!</div>
}
