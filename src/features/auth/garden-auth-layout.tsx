import { gardenBrand } from '@/components/layout/garden-brand'

export function GardenAuthLayout({
  children,
  actions,
}: {
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div
      data-slot='garden-auth-page'
      className='fixed inset-0 flex flex-col overflow-hidden text-foreground'
    >
      <header className='shrink-0 bg-background' data-slot='header'>
        <div className='mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8'>
          <div className='flex items-center gap-3'>
            <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <gardenBrand.Logo className='size-4' aria-hidden='true' />
            </span>
            <div className='grid text-sm leading-tight'>
              <span className='font-semibold'>{gardenBrand.name}</span>
              <span className='text-xs'>{gardenBrand.subtitle}</span>
            </div>
          </div>
          {actions}
        </div>
      </header>

      {children}
      <footer
        data-garden-auth-panel
        className='shrink-0 border-t bg-background'
      >
        <div className='mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-8'>
          © 2026 {gardenBrand.name} · {gardenBrand.subtitle}
        </div>
      </footer>
    </div>
  )
}
