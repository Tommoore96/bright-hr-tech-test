import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { ReactNode } from 'react'

export function customRender(
  ui: React.ReactElement,
  {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    }),
    routeComponent = ui,
    routePath = '/'
  } = {}
) {
  const rootRoute = createRootRoute({
    component: Outlet
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routePath,
    component: () => routeComponent
  })

  const routeTree = rootRoute.addChildren([indexRoute])
  const router = createRouter({ routeTree })

  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>
      {/* @ts-expect-error This seems unavoidable without a typescript error & there is no official documented fix https://github.com/TanStack/router/discussions/655 */}
      <RouterProvider router={router}>{ui}</RouterProvider>
    </QueryClientProvider>
  )

  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>
          {/* @ts-expect-error This seems unavoidable without a typescript error & there is no official documented fix https://github.com/TanStack/router/discussions/655 */}
          <RouterProvider router={router}>{rerenderUi}</RouterProvider>
        </QueryClientProvider>
      )
  }
}
////

export function routerRender(Component: ReactNode) {
  const rootRoute = createRootRoute({
    component: Outlet
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => Component
  })

  const routeTree = rootRoute.addChildren([indexRoute])
  const router = createRouter({ routeTree })

  //@ts-expect-error This seems unavoidable without a typescript error &
  // there is no official documented fix https://github.com/TanStack/router/discussions/655
  return render(<RouterProvider router={router} />)
}

export function renderWithClient(client: QueryClient, ui: React.ReactElement) {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  )
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>
      )
  }
}

export const queryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  const QueryWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  QueryWrapper.displayName = 'QueryWrapper'
  return QueryWrapper
}

////

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
  const QueryWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  QueryWrapper.displayName = 'QueryWrapper'
  return QueryWrapper
}
