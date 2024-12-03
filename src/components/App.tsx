import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'ag-grid-community/styles/ag-grid.css'
import { AbsencesTable } from './absences-table'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-col justify-center overflow-hidden bg-white px-3 pt-6 align-middle sm:px-7 md:px-12 md:pt-8 lg:mx-auto lg:max-w-4xl">
        <h1 className="text-lg font-bold">Absences</h1>
        <AbsencesTable className="pt-4" />
      </div>
    </QueryClientProvider>
  )
}

export default App
