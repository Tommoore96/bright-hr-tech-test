import { screen, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { Route as IndexRoute } from '../../src/routes/index.lazy'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { getAbsences, getConflicts } from 'api'
import { customRender, renderWithClient } from '../utils'

const IdexComponent = IndexRoute.options.component

const queryClient = new QueryClient()

const server = setupServer(
  http.get(
    'https://front-end-kata.brighthr.workers.dev/api/absences',
    ({ request, params, cookies }) => {
      console.log('MSW')
      return HttpResponse.json([])
    }
  )
)

// Enable request interception.
beforeAll(() => server.listen())

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers())

// Don't forget to clean up afterwards.
afterAll(() => server.close())

describe('Index', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  test.only('displays loading state', async () => {
    customRender(<IdexComponent />, { client: queryClient })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays error state', async () => {
    getAbsences.mockRejectedValueOnce(new Error('Error fetching data'))
    renderWithProviders(<Route />)
    await waitFor(() =>
      expect(screen.getByText('Error fetching data')).toBeInTheDocument()
    )
  })

  test('displays data correctly', async () => {
    getAbsences.mockResolvedValueOnce([
      {
        id: 1,
        employee: { id: '1', firstName: 'John', lastName: 'Doe' },
        absenceType: 'SICKNESS',
        startDate: new Date('2024-01-01'),
        days: 3,
        approved: true
      }
    ])
    getConflicts.mockResolvedValueOnce([{ conflicts: true }])
    renderWithProviders(<Route />)
    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    )
  })

  test('handles conflicts error correctly', async () => {
    getAbsences.mockResolvedValueOnce([
      {
        id: 1,
        employee: { id: '1', firstName: 'John', lastName: 'Doe' },
        absenceType: 'SICKNESS',
        startDate: new Date('2024-01-01'),
        days: 3,
        approved: true
      }
    ])
    getConflicts.mockRejectedValueOnce(new Error('Error fetching conflicts'))
    renderWithProviders(<Route />)
    await waitFor(() =>
      expect(
        screen.getByText('There was an error fetching all conflict data.')
      ).toBeInTheDocument()
    )
  })
})
