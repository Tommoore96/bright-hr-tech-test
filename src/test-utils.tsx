import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { ReactNode } from 'react'

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
