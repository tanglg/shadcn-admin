import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import * as AD from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import * as Cmd from '@/components/ui/command'
import * as Dialog from '@/components/ui/dialog'
import * as Menu from '@/components/ui/dropdown-menu'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as Select from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import * as Sheet from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import * as Table from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ComingSoon } from '@/components/coming-soon'
import { ConfigDrawer } from '@/components/config-drawer'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DatePicker } from '@/components/date-picker'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LearnMore } from '@/components/learn-more'
import { LongText } from '@/components/long-text'
import { PasswordInput } from '@/components/password-input'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SelectDropdown } from '@/components/select-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTableDemo } from './data-table-demo'

export function ComponentLibrary() {
  const [query, setQuery] = useState('')
  const [date, setDate] = useState<Date>()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const form = useForm({ defaultValues: { zone: '' } })
  const zones = [
    { label: '东校区', value: 'east' },
    { label: '西校区', value: 'west' },
  ]

  const groups: { title: string; demos: [string, string, ReactNode][] }[] = [
    {
      title: '表单与输入',
      demos: [
        [
          '按钮',
          'Button',
          <div className='flex flex-wrap gap-2'>
            <Button onClick={() => toast.success('已保存演示设置')}>
              保存
            </Button>
            <Button variant='outline'>次要操作</Button>
            <Button disabled>不可用</Button>
          </div>,
        ],
        [
          '文本输入',
          'Input · Label · Textarea · PasswordInput',
          <div className='grid gap-2'>
            <Label htmlFor='demo-name'>收货人</Label>
            <Input id='demo-name' placeholder='输入姓名' />
            <Textarea aria-label='配送备注' placeholder='输入配送备注' />
            <PasswordInput
              aria-label='演示密码'
              placeholder='输入后可切换密码可见性'
            />
          </div>,
        ],
        [
          '开关与选项',
          'Checkbox · RadioGroup · Switch',
          <div className='grid gap-3'>
            <Label>
              <Checkbox defaultChecked /> 同意接收配送提醒
            </Label>
            <Label>
              <Switch /> 开启消息通知
            </Label>
            <RadioGroup defaultValue='morning' aria-label='配送时段'>
              <Label>
                <RadioGroupItem value='morning' /> 上午
              </Label>
              <Label>
                <RadioGroupItem value='afternoon' /> 下午
              </Label>
            </RadioGroup>
          </div>,
        ],
        [
          '下拉选择',
          'Select',
          <Select.Select defaultValue='east'>
            <Select.SelectTrigger aria-label='选择校区' className='w-full'>
              <Select.SelectValue />
            </Select.SelectTrigger>
            <Select.SelectContent>
              {zones.map(({ label, value }) => (
                <Select.SelectItem key={value} value={value}>
                  {label}
                </Select.SelectItem>
              ))}
            </Select.SelectContent>
          </Select.Select>,
        ],
        [
          '表单验证',
          'Form · SelectDropdown',
          <Form {...form}>
            <form
              className='grid gap-3'
              onSubmit={form.handleSubmit(() =>
                toast.success('校区选择已通过校验')
              )}
            >
              <FormField
                control={form.control}
                name='zone'
                rules={{ required: '请选择校区' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配送校区</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      items={zones}
                      placeholder='选择校区'
                      isControlled
                      className='w-full'
                    />
                    <FormDescription>
                      直接提交可以查看必填提示。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='w-fit' type='submit'>
                提交示例
              </Button>
            </form>
          </Form>,
        ],
        [
          '验证码',
          'InputOTP',
          <InputOTP maxLength={6} aria-label='六位演示验证码'>
            <InputOTPGroup>
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>,
        ],
        [
          '日期选择',
          'Calendar · DatePicker',
          <div className='grid gap-3'>
            <DatePicker
              selected={date}
              onSelect={setDate}
              placeholder='选择历史日期'
            />
            <Calendar
              className='max-w-full'
              mode='single'
              selected={date}
              onSelect={setDate}
              disabled={{ after: new Date() }}
            />
          </div>,
        ],
      ],
    },
    {
      title: '展示与反馈',
      demos: [
        [
          '卡片与状态',
          'Card · Avatar · Badge · Separator',
          <Card className='w-full gap-3 py-4 shadow-none'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Avatar>
                  <AvatarFallback>林</AvatarFallback>
                </Avatar>
                林同学
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-3'>
              <Separator />
              <div className='flex flex-wrap gap-2'>
                <Badge>已送达</Badge>
                <Badge variant='secondary'>配送中</Badge>
                <Badge variant='outline'>待取货</Badge>
              </div>
            </CardContent>
          </Card>,
        ],
        [
          '提示与通知',
          'Alert · Sonner · Toaster',
          <div className='grid gap-3'>
            <Alert>
              <AlertTitle>配送提醒</AlertTitle>
              <AlertDescription>请在 18:00 前到东门取货。</AlertDescription>
            </Alert>
            <Button
              variant='outline'
              className='w-fit'
              onClick={() =>
                toast.success('演示通知', { description: '配送提醒已开启。' })
              }
            >
              显示通知
            </Button>
          </div>,
        ],
        [
          '加载占位',
          'Skeleton',
          <div
            className='flex items-center gap-3'
            role='status'
            aria-label='加载占位示例'
          >
            <Skeleton className='size-10 rounded-full' />
            <div className='grid gap-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>,
        ],
        [
          '长文本与滚动',
          'LongText · ScrollArea',
          <div className='grid gap-3'>
            <LongText className='w-40' contentClassName='max-w-64'>
              这是一段较长的配送说明，悬停或在窄屏上点击可查看完整内容。
            </LongText>
            <ScrollArea className='h-24 rounded-md border'>
              <ul className='space-y-2 p-3 text-sm'>
                {[
                  '东门取货点',
                  '西门取货点',
                  '南门取货点',
                  '北门取货点',
                  '食堂服务台',
                ].map((location) => (
                  <li key={location}>{location}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>,
        ],
        [
          '基础表格',
          'Table',
          <Table.Table>
            <Table.TableHeader>
              <Table.TableRow>
                <Table.TableHead>商品</Table.TableHead>
                <Table.TableHead>数量</Table.TableHead>
              </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
              <Table.TableRow>
                <Table.TableCell>小白菜</Table.TableCell>
                <Table.TableCell>3</Table.TableCell>
              </Table.TableRow>
              <Table.TableRow>
                <Table.TableCell>胡萝卜</Table.TableCell>
                <Table.TableCell>2</Table.TableCell>
              </Table.TableRow>
            </Table.TableBody>
          </Table.Table>,
        ],
      ],
    },
    {
      title: '导航与浮层',
      demos: [
        [
          '标签页与折叠',
          'Tabs · Collapsible',
          <div className='grid gap-3'>
            <Tabs defaultValue='pending'>
              <TabsList>
                <TabsTrigger value='pending'>待配送</TabsTrigger>
                <TabsTrigger value='done'>已送达</TabsTrigger>
              </TabsList>
              <TabsContent value='pending'>有 3 单等待配送。</TabsContent>
              <TabsContent value='done'>今天已送达 12 单。</TabsContent>
            </Tabs>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant='outline'>展开或收起说明</Button>
              </CollapsibleTrigger>
              <CollapsibleContent className='pt-2 text-sm'>
                每天上午 9 点开始配送。
              </CollapsibleContent>
            </Collapsible>
          </div>,
        ],
        [
          '命令列表',
          'Command',
          <Cmd.Command className='border'>
            <Cmd.CommandInput placeholder='筛选取货点…' />
            <Cmd.CommandList>
              <Cmd.CommandEmpty>没有匹配的取货点。</Cmd.CommandEmpty>
              <Cmd.CommandGroup heading='取货点'>
                {zones.map(({ label }) => (
                  <Cmd.CommandItem
                    key={label}
                    onSelect={() => toast.info('已选择' + label)}
                  >
                    {label}
                  </Cmd.CommandItem>
                ))}
              </Cmd.CommandGroup>
            </Cmd.CommandList>
          </Cmd.Command>,
        ],
        [
          '下拉菜单',
          'DropdownMenu',
          <Menu.DropdownMenu>
            <Menu.DropdownMenuTrigger asChild>
              <Button variant='outline'>打开操作菜单</Button>
            </Menu.DropdownMenuTrigger>
            <Menu.DropdownMenuContent>
              <Menu.DropdownMenuItem onSelect={() => toast.info('已选择编辑')}>
                编辑
              </Menu.DropdownMenuItem>
              <Menu.DropdownMenuItem onSelect={() => toast.info('已选择归档')}>
                归档
              </Menu.DropdownMenuItem>
            </Menu.DropdownMenuContent>
          </Menu.DropdownMenu>,
        ],
        [
          '弹出说明',
          'Popover · Tooltip · LearnMore',
          <div className='flex flex-wrap items-center gap-3'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>查看取货点</Button>
              </PopoverTrigger>
              <PopoverContent>东门服务台，08:00–18:00。</PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline'>悬停或聚焦</Button>
              </TooltipTrigger>
              <TooltipContent>这里是 Tooltip 提示。</TooltipContent>
            </Tooltip>
            <LearnMore>配送通知可在设置中调整。</LearnMore>
          </div>,
        ],
        [
          '对话框与抽屉',
          'Dialog · Sheet',
          <div className='flex flex-wrap gap-2'>
            <Dialog.Dialog>
              <Dialog.DialogTrigger asChild>
                <Button variant='outline'>打开对话框</Button>
              </Dialog.DialogTrigger>
              <Dialog.DialogContent>
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>配送详情</Dialog.DialogTitle>
                  <Dialog.DialogDescription>
                    示例订单将在今天送达。
                  </Dialog.DialogDescription>
                </Dialog.DialogHeader>
              </Dialog.DialogContent>
            </Dialog.Dialog>
            <Sheet.Sheet>
              <Sheet.SheetTrigger asChild>
                <Button variant='outline'>打开抽屉</Button>
              </Sheet.SheetTrigger>
              <Sheet.SheetContent>
                <Sheet.SheetHeader>
                  <Sheet.SheetTitle>订单详情</Sheet.SheetTitle>
                  <Sheet.SheetDescription>
                    这是从右侧打开的详情面板。
                  </Sheet.SheetDescription>
                </Sheet.SheetHeader>
              </Sheet.SheetContent>
            </Sheet.Sheet>
          </div>,
        ],
        [
          '确认提示',
          'AlertDialog · ConfirmDialog',
          <div className='flex flex-wrap gap-2'>
            <AD.AlertDialog>
              <AD.AlertDialogTrigger asChild>
                <Button variant='outline'>显示警告</Button>
              </AD.AlertDialogTrigger>
              <AD.AlertDialogContent>
                <AD.AlertDialogHeader>
                  <AD.AlertDialogTitle>确认归档？</AD.AlertDialogTitle>
                  <AD.AlertDialogDescription>
                    此操作仅用于演示。
                  </AD.AlertDialogDescription>
                </AD.AlertDialogHeader>
                <AD.AlertDialogFooter>
                  <AD.AlertDialogCancel>取消</AD.AlertDialogCancel>
                  <AD.AlertDialogAction
                    onClick={() => toast.success('已确认归档')}
                  >
                    归档
                  </AD.AlertDialogAction>
                </AD.AlertDialogFooter>
              </AD.AlertDialogContent>
            </AD.AlertDialog>
            <Button variant='outline' onClick={() => setConfirmOpen(true)}>
              打开确认框
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title='确认提交？'
              desc='确认后将显示一条演示通知。'
              cancelBtnText='取消'
              confirmText='确认'
              handleConfirm={() => {
                setConfirmOpen(false)
                toast.success('已确认提交')
              }}
            />
          </div>,
        ],
      ],
    },
    {
      title: '共享组件与实际场景',
      demos: [
        [
          '数据表格',
          'DataTableToolbar · DataTableFacetedFilter · DataTableColumnHeader · DataTableViewOptions · DataTablePagination · DataTableBulkActions',
          <DataTableDemo />,
        ],
        [
          '页面布局与侧栏',
          'AuthenticatedLayout · Header · Main · Sidebar · AppSidebar · AppTitle · NavGroup · NavUser · TeamSwitcher · TopNav · SkipToMain · NavigationProgress',
          <p className='text-sm text-muted-foreground'>
            当前页面使用共享布局。可用左上角按钮折叠侧栏，或访问{' '}
            <Link to='/' className='font-medium text-primary underline'>
              Dashboard
            </Link>{' '}
            查看顶部导航。按 Tab 可定位页面的跳转链接。
          </p>,
        ],
        [
          '顶部工具与账号菜单',
          'Search · CommandMenu · ThemeSwitch · ConfigDrawer · ProfileDropdown · SignOutDialog',
          <p className='text-sm text-muted-foreground'>
            使用本页顶部工具打开全局搜索、切换主题或调整布局。头像菜单里可以查看退出确认框，点击取消即可返回。
          </p>,
        ],
        [
          '占位页',
          'ComingSoon',
          <div className='grid gap-3'>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant='outline'>展开占位示例</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='[&_h1]:text-xl [&_svg]:size-8 [&>div]:h-48'>
                  <ComingSoon />
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Link
              to='/help-center'
              className='w-fit text-sm font-medium text-primary underline'
            >
              查看 Help Center 完整页面
            </Link>
          </div>,
        ],
      ],
    },
  ]
  const keyword = query.trim().toLowerCase()
  const results = groups
    .map(({ title, demos }) => ({
      title,
      demos: demos.filter(([label, names]) =>
        `${title} ${label} ${names}`.toLowerCase().includes(keyword)
      ),
    }))
    .filter(({ demos }) => demos.length > 0)
  const count = results.reduce((total, { demos }) => total + demos.length, 0)

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main className='grid content-start gap-8'>
        <div className='grid gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>组件库</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              浏览后台使用的组件，并在示例中体验它们的交互。
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Input
              className='max-w-sm bg-card'
              type='search'
              aria-label='搜索组件'
              placeholder='搜索组件，例如 Button 或下拉菜单'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span role='status' className='text-sm text-muted-foreground'>
              {count} 组示例
            </span>
          </div>
        </div>
        {results.map(({ title, demos }) => (
          <section key={title} className='grid gap-3'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            <div className='grid gap-4 @2xl/content:grid-cols-2 @6xl/content:grid-cols-3'>
              {demos.map(([label, names, demo]) => (
                <Card
                  key={names}
                  className={
                    names.startsWith('DataTable')
                      ? 'col-span-full min-w-0'
                      : 'min-w-0'
                  }
                >
                  <CardHeader>
                    <CardTitle>{label}</CardTitle>
                    <CardDescription className='break-words'>
                      {names}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{demo}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
        {count === 0 && (
          <p className='rounded-lg border bg-card p-6 text-sm text-muted-foreground'>
            没有匹配的组件，请试试其他关键词。
          </p>
        )}
      </Main>
    </>
  )
}
