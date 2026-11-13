import { Link } from '@tanstack/react-router'
import { ClipboardList, Leaf, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { gardenBrand } from '@/components/layout/garden-brand'
import { GardenAuthLayout } from '../garden-auth-layout'
import { SignUpForm } from './components/sign-up-form'

const services = [
  { Icon: Leaf, text: '对接校园食堂的蔬菜采购需求' },
  { Icon: Truck, text: '协调备货、配送和到校交接' },
  { Icon: ClipboardList, text: '记录收货与验收信息' },
]

export function SignUp() {
  return (
    <GardenAuthLayout
      actions={
        <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground sm:gap-x-4 sm:text-sm'>
          <p className='max-sm:order-last max-sm:w-full'>
            注册遇到问题？{' '}
            <a
              href='tel:4008892026'
              className='whitespace-nowrap hover:text-primary hover:underline'
            >
              服务热线 400-889-2026
            </a>
          </p>
          <span aria-hidden='true' className='hidden h-4 border-s sm:block' />
          <p className='whitespace-nowrap'>
            已有账号？{' '}
            <Link
              to='/sign-in'
              className='font-semibold text-primary hover:underline'
            >
              立即登录
            </Link>
          </p>
        </div>
      }
    >
      <main className='mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-6 overflow-y-auto overscroll-y-contain px-4 py-4 sm:px-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.5fr)] lg:gap-12'>
        <section
          aria-labelledby='sign-up-intro'
          className='min-w-0 space-y-6 text-shadow-[0_1px_8px_var(--background)] sm:space-y-8'
        >
          <p className='flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-primary'>
            <span aria-hidden='true' className='h-0.5 w-6 bg-primary' />
            {gardenBrand.subtitle}
          </p>
          <h1
            id='sign-up-intro'
            className='font-[Georgia,Songti_SC,SimSun,serif] text-4xl leading-tight font-bold tracking-tight text-primary xl:text-5xl'
          >
            把新鲜蔬菜
            <br />
            <span className='underline decoration-primary decoration-4 underline-offset-4'>
              送到校园
            </span>
          </h1>
          <p className='max-w-sm text-sm leading-relaxed text-foreground sm:text-base'>
            连接蔬菜供应商、配送团队和校园食堂。注册后可对接采购、配送和验收流程。
          </p>
          <ul className='space-y-3 border-t border-foreground/25 pt-5 text-sm font-medium'>
            {services.map(({ Icon, text }) => (
              <li key={text} className='flex items-center gap-3'>
                <span className='grid size-8 shrink-0 place-items-center rounded-full border border-current text-primary'>
                  <Icon className='size-4' aria-hidden='true' />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='sign-up-title' className='min-w-0'>
          <Card
            data-garden-auth-panel
            className='gap-4 overflow-hidden pt-0 pb-5'
          >
            <CardHeader className='gap-2 border-t-4 border-t-primary bg-linear-to-b from-primary/10 to-primary/5 px-4 py-4 text-primary shadow-[inset_0_-1px_0_var(--border)] sm:px-8'>
              <p
                lang='en'
                className='font-serif text-xs font-bold tracking-[0.18em]'
              >
                CREATE ACCOUNT
              </p>
              <h2
                id='sign-up-title'
                className='font-[Georgia,Songti_SC,SimSun,serif] text-2xl leading-tight font-semibold tracking-wide sm:text-3xl'
              >
                用户注册
              </h2>
            </CardHeader>
            <CardContent className='px-4 sm:px-8'>
              <SignUpForm />
              <p className='mt-4 text-center text-sm text-muted-foreground'>
                已有账号？{' '}
                <Link
                  to='/sign-in'
                  className='font-semibold text-primary hover:underline'
                >
                  返回登录
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </GardenAuthLayout>
  )
}
