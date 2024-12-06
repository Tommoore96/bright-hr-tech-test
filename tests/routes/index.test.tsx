import { screen, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { Route as IndexRoute } from '../../src/routes/index.lazy'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { customRender } from '../utils'

const IndexComponent = IndexRoute.options.component as React.ComponentType

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

// I would set up my own function to carry all this out & reuse it
const server = setupServer()

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Index', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  test('displays loading state', async () => {
    server.use(
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/absences',
        () => {
          return HttpResponse.json([])
        }
      )
    )
    customRender(<IndexComponent />, { client: queryClient })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays error state', async () => {
    server.use(
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/absences',
        () => {
          console.log('ERROR')
          return new HttpResponse(null, { status: 400 })
        }
      )
    )
    customRender(<IndexComponent />, { client: queryClient })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(
      () => expect(screen.getByText('Error fetching data')).toBeInTheDocument(),
      { timeout: 4000 }
    )
  })

  test('displays data correctly', async () => {
    server.use(
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/absences',
        () => {
          return HttpResponse.json([
            {
              id: 1,
              employee: { id: '1', firstName: 'John', lastName: 'Doe' },
              absenceType: 'SICKNESS',
              startDate: new Date('2024-01-01'),
              days: 3,
              approved: true
            },
            {
              id: 2,
              employee: { id: '2', firstName: 'Jane', lastName: 'Doe' },
              absenceType: 'SICKNESS',
              startDate: new Date('2024-01-01'),
              days: 3,
              approved: true
            }
          ])
        }
      ),
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/conflict/1',
        () => {
          return HttpResponse.json({ conflicts: true })
        }
      ),
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/conflict/2',
        () => {
          return HttpResponse.json({ conflicts: false })
        }
      )
    )
    customRender(<IndexComponent />, { client: queryClient })
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()

      /**
       * getBy queries error if 2 elements are found, so I don't need to check for Jane Doe's conflict icon
       */
      const conflictIcon = screen.getByText('⚠️')
      expect(conflictIcon.closest('a')).toContainHTML('John Doe')

      expect(
        screen.queryByText('There was an error fetching all conflict data.')
      ).toBeNull()
    })
  })

  test('displays error message if not all conflict data is returned', async () => {
    server.use(
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/absences',
        () => {
          return HttpResponse.json([
            {
              id: 1,
              employee: { id: '1', firstName: 'John', lastName: 'Doe' },
              absenceType: 'SICKNESS',
              startDate: new Date('2024-01-01'),
              days: 3,
              approved: true
            },
            {
              id: 2,
              employee: { id: '2', firstName: 'Jane', lastName: 'Doe' },
              absenceType: 'SICKNESS',
              startDate: new Date('2024-01-01'),
              days: 3,
              approved: true
            }
          ])
        }
      ),
      http.get(
        'https://front-end-kata.brighthr.workers.dev/api/conflict/1',
        () => {
          return HttpResponse.json({ conflicts: true })
        }
      )
    )
    customRender(<IndexComponent />, { client: queryClient })

    await waitFor(() =>
      expect(
        screen.getByText('There was an error fetching all conflict data.')
      ).toBeInTheDocument()
    )
  })
})
