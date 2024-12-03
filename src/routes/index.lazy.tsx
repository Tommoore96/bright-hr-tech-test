import { createLazyFileRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AbsencesTable } from 'components/absences-table'

const queryClient = new QueryClient()

export const Route = createLazyFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-default">
        <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden px-3 pb-12 pt-6 align-middle sm:px-7 md:gap-8 md:px-12 md:pt-8 lg:mx-auto lg:max-w-4xl">
          <h1 className="text-4xl font-bold">Absences</h1>
          <AbsencesTable />
        </div>
      </div>
    </QueryClientProvider>
  )
}
