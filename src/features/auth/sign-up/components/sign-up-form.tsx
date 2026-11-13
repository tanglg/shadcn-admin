import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  Contact,
  KeyRound,
  LockKeyhole,
  Phone,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  company: z.string().trim().min(2, '请输入企业名称'),
  creditCode: z
    .string()
    .trim()
    .regex(/^[0-9A-Z]{18}$/i, '请输入 18 位统一社会信用代码'),
  adminName: z.string().trim().min(2, '请输入管理员姓名'),
  phone: z
    .string()
    .trim()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  smsCode: z.string().regex(/^\d{6}$/, '请输入 6 位短信验证码'),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
      '密码需为 8–20 位字母与数字组合'
    ),
  agreement: z
    .boolean()
    .refine((agreed) => agreed, '请先同意平台用户服务协议与隐私政策'),
})

const sections = [
  {
    title: '企业信息',
    fields: [
      {
        name: 'company',
        label: '企业名称',
        placeholder: '请输入营业执照上的企业全称',
        Icon: Building2,
        autoComplete: 'organization',
      },
      {
        name: 'creditCode',
        label: '统一社会信用代码',
        placeholder: '请输入 18 位统一社会信用代码',
        Icon: Contact,
        maxLength: 18,
      },
    ],
  },
  {
    title: '管理员信息',
    fields: [
      {
        name: 'adminName',
        label: '管理员姓名',
        placeholder: '请输入管理员姓名',
        Icon: UserRound,
        autoComplete: 'name',
      },
      {
        name: 'phone',
        label: '手机号码',
        placeholder: '请输入手机号码',
        Icon: Phone,
        type: 'tel',
        maxLength: 11,
        autoComplete: 'tel-national',
      },
      {
        name: 'smsCode',
        label: '短信验证码',
        placeholder: '6 位验证码',
        Icon: KeyRound,
        maxLength: 6,
        autoComplete: 'one-time-code',
      },
      {
        name: 'password',
        label: '设置登录密码',
        placeholder: '8–20 位字母与数字组合',
        Icon: LockKeyhole,
        autoComplete: 'new-password',
      },
    ],
  },
] as const

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      company: '',
      creditCode: '',
      adminName: '',
      phone: '',
      smsCode: '',
      password: '',
      agreement: false,
    },
  })

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() => {
          toast.info('资料校验通过。企业注册服务尚未接入，申请未提交。')
        })}
        className='space-y-3'
      >
        {sections.map(({ title, fields }) => (
          <fieldset key={title} className='min-w-0'>
            <legend className='mb-2 text-sm font-semibold'>{title}</legend>
            <div className='grid grid-cols-1 gap-3'>
              {fields.map(({ name, label, Icon, ...inputProps }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className='min-w-0'>
                      <FormLabel>
                        {label}
                        <span aria-hidden='true' className='text-destructive'>
                          *
                        </span>
                      </FormLabel>
                      <div className='flex gap-2'>
                        <div className='relative min-w-0 flex-1'>
                          <Icon
                            className='pointer-events-none absolute inset-s-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground'
                            aria-hidden='true'
                          />
                          <FormControl>
                            {name === 'password' ? (
                              <PasswordInput
                                {...field}
                                {...inputProps}
                                required
                                className='[&>input]:h-10 [&>input]:ps-9 [&>input]:pe-9 [&>input[aria-invalid=true]]:border-destructive'
                              />
                            ) : (
                              <Input
                                {...field}
                                {...inputProps}
                                required
                                inputMode={
                                  name === 'smsCode' ? 'numeric' : undefined
                                }
                                className='h-10 ps-9'
                              />
                            )}
                          </FormControl>
                        </div>
                        {name === 'smsCode' && (
                          <Button
                            type='button'
                            variant='outline'
                            className='h-10 px-2.5'
                            onClick={async () => {
                              if (
                                await form.trigger('phone', {
                                  shouldFocus: true,
                                })
                              ) {
                                toast.info(
                                  '短信服务尚未接入。演示时可填写任意 6 位数字。'
                                )
                              }
                            }}
                          >
                            获取验证码
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </fieldset>
        ))}

        <FormField
          control={form.control}
          name='agreement'
          render={({ field }) => (
            <FormItem className='border-t pt-4'>
              <div className='flex items-start gap-2'>
                <FormControl>
                  <Checkbox
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <FormLabel className='leading-tight font-normal text-muted-foreground'>
                  我已阅读并同意《平台用户服务协议》与《隐私政策》
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-xs text-muted-foreground'>
          演示表单，请勿填写真实企业或个人资料。
        </p>
        <Button type='submit' className='h-11 w-full'>
          提交注册申请
        </Button>
      </form>
    </Form>
  )
}
