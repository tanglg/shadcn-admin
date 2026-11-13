import { Link, useSearch } from '@tanstack/react-router'
import { QrCode } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GardenAuthLayout } from '../garden-auth-layout'
import { PhoneLoginForm } from './components/phone-login-form'
import { UserAuthForm } from './components/user-auth-form'

const methods = [
  { value: 'phone', label: '手机验证码' },
  { value: 'password', label: '账号密码' },
  { value: 'wechat', label: '微信扫码' },
]

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <GardenAuthLayout>
      <main className='mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-8 overflow-y-auto overscroll-y-contain px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.5fr)] lg:gap-12'>
        <section
          aria-labelledby='sign-in-intro'
          className='min-w-0 space-y-4 text-primary text-shadow-[0_1px_8px_var(--background)]'
        >
          <h1
            id='sign-in-intro'
            className='font-[Georgia,Songti_SC,SimSun,serif] text-4xl leading-tight font-bold xl:text-6xl'
          >
            把新鲜蔬菜
            <br />
            <span className='underline decoration-4 underline-offset-8'>
              送到校园
            </span>
          </h1>
          <p className='pt-2 text-base font-medium sm:text-lg'>
            校园蔬菜一站式配送服务平台
          </p>
        </section>

        <Card
          data-garden-auth-panel
          className='min-w-0 gap-4 overflow-hidden pt-0 pb-6 sm:pb-8'
        >
          <CardHeader className='gap-2 border-t-4 border-t-primary bg-linear-to-b from-primary/10 to-primary/5 px-5 py-5 text-primary sm:px-10 sm:py-7'>
            <p
              lang='en'
              className='font-serif text-xs font-bold tracking-[0.18em]'
            >
              USER LOGIN
            </p>
            <h2 className='font-[Georgia,Songti_SC,SimSun,serif] text-3xl leading-tight font-semibold sm:text-4xl'>
              用户登录
            </h2>
          </CardHeader>
          <CardContent className='px-5 sm:px-10'>
            <Tabs defaultValue='phone' className='gap-5'>
              <TabsList
                aria-label='登录方式'
                className='h-11 w-full rounded-none border-b bg-transparent p-0'
              >
                {methods.map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className='h-full rounded-none border-0 border-b-3 border-transparent px-1 data-[state=active]:border-button-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-button-primary dark:data-[state=active]:bg-transparent'
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value='phone'>
                <PhoneLoginForm />
              </TabsContent>
              <TabsContent value='password'>
                <UserAuthForm redirectTo={redirect} garden />
              </TabsContent>
              <TabsContent
                value='wechat'
                className='grid min-h-52 place-content-center justify-items-center gap-3 text-center'
              >
                <QrCode className='size-10 text-primary' aria-hidden='true' />
                <p className='font-medium'>微信扫码登录</p>
                <p className='text-sm text-muted-foreground'>
                  微信登录服务尚未接入，暂时无法生成登录二维码。
                </p>
              </TabsContent>
            </Tabs>
            <p className='mt-5 text-center text-sm text-muted-foreground'>
              还没有账号？{' '}
              <Link
                to='/sign-up'
                className='font-semibold text-primary hover:underline'
              >
                立即注册
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </GardenAuthLayout>
  )
}
