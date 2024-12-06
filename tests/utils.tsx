import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

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
