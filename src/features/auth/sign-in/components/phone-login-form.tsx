import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquare, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const phoneLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  code: z.string().regex(/^\d{6}$/, '请输入 6 位短信验证码'),
})

export function PhoneLoginForm() {
  const form = useForm<z.infer<typeof phoneLoginSchema>>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: '', code: '' },
  })

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() => toast.info('短信登录服务尚未接入。'))}
        className='grid gap-4 sm:gap-5'
      >
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <div className='relative'>
                <Phone
                  className='pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
                  aria-hidden='true'
                />
                <FormControl>
                  <Input
                    {...field}
                    type='tel'
                    autoComplete='tel-national'
                    required
                    maxLength={11}
                    placeholder='请输入手机号码'
                    className='h-11 ps-9'
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>短信验证码</FormLabel>
              <div className='flex gap-2'>
                <div className='relative min-w-0 flex-1'>
                  <MessageSquare
                    className='pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
                    aria-hidden='true'
                  />
                  <FormControl>
                    <Input
                      {...field}
                      inputMode='numeric'
                      autoComplete='one-time-code'
                      required
                      maxLength={6}
                      placeholder='请输入短信验证码'
                      className='h-11 ps-9'
                    />
                  </FormControl>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  className='h-11'
                  onClick={async () => {
                    if (await form.trigger('phone', { shouldFocus: true }))
                      toast.info('短信服务尚未接入，暂时无法发送验证码。')
                  }}
                >
                  获取验证码
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-1 h-12 w-full'>登录</Button>
      </form>
    </Form>
  )
}
