import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { TeamSwitcher } from './team-switcher'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const { colorTheme } = useTheme()
  const { isMobile } = useSidebar()
  const showGardenBrand = colorTheme === 'garden-fresh' && !isMobile

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-slot='header'
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      {showGardenBrand && (
        <div className='garden-header-brand'>
          <TeamSwitcher teams={sidebarData.teams} />
        </div>
      )}
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          colorTheme !== 'garden-fresh' &&
            offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger variant='outline' className='max-md:scale-125' />
        <Separator orientation='vertical' className='h-6' />
        {children}
      </div>
    </header>
  )
}
