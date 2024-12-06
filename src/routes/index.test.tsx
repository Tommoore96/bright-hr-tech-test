import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route } from './index.lazy'
import { getAbsences, getConflicts } from 'api'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock the API calls
vi.mock('api', () => ({
  getAbsences: vi.fn(),
  getConflicts: vi.fn()
}))

const queryClient = new QueryClient()

describe('Index', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  test('displays loading state', async () => {
    getAbsences.mockResolvedValueOnce([])
    renderWithProviders(<Route />)
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
