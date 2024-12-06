import { ReactNode } from '@tanstack/react-router'
import { cn } from '../utils/cn'

export default function Page({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col justify-center gap-4 overflow-hidden px-3 pb-12 pt-6 align-middle sm:px-7 md:gap-8 md:px-12 md:pt-8 lg:mx-auto lg:max-w-4xl',
        className
      )}
    >
      {children}
    </div>
  )
}
