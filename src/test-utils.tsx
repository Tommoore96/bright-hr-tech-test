import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider
} from '@tanstack/react-router'
import { ReactNode } from 'react'

const rootRoute = createRootRoute({
  component: () => <Outlet />
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Outlet />
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({
  routeTree: routeTree
})

export function RouterWrapper({ children }: { children: ReactNode }) {
  //@ts-expect-error This seems unavoidable without a typescript error &
  // there is no official documented fix https://github.com/TanStack/router/discussions/655
  return <RouterProvider router={router}>{children}</RouterProvider>
}
