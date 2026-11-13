import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { SignUpForm } from './sign-up-form'

vi.mock('sonner', () => ({ toast: { info: vi.fn() } }))

describe('SignUpForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows required field errors and does not accept an empty application', async () => {
    const screen = await render(<SignUpForm />)
    await screen.getByRole('button', { name: '提交注册申请' }).click()

    await expect
      .element(screen.getByText('请输入企业名称', { exact: true }))
      .toBeVisible()
    await expect.element(screen.getByText('请输入有效的手机号码')).toBeVisible()
    await expect
      .element(screen.getByText('请先同意平台用户服务协议与隐私政策'))
      .toBeVisible()
    expect(toast.info).not.toHaveBeenCalled()
  })

  it('validates the phone before offering the SMS demo', async () => {
    const screen = await render(<SignUpForm />)
    const phone = screen.getByRole('textbox', { name: '手机号码' })
    const sendCode = screen.getByRole('button', { name: '获取验证码' })

    await sendCode.click()
    await expect.element(phone).toHaveFocus()
    expect(toast.info).not.toHaveBeenCalled()

    await phone.fill('13800138000')
    await sendCode.click()
    await vi.waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith(
        expect.stringContaining('短信服务尚未接入')
      )
    )
  })

  it('accepts valid demo details without claiming an application was submitted', async () => {
    const screen = await render(<SignUpForm />)
    await screen.getByRole('textbox', { name: '企业名称' }).fill('示例企业')
    await screen
      .getByRole('textbox', { name: '统一社会信用代码' })
      .fill('123456789012345678')
    await screen.getByRole('textbox', { name: '管理员姓名' }).fill('测试员')
    await screen.getByRole('textbox', { name: '手机号码' }).fill('13800138000')
    await screen.getByRole('textbox', { name: '短信验证码' }).fill('123456')
    await screen.getByLabelText('设置登录密码').fill('demo1234')
    await screen.getByRole('checkbox').click()
    await screen.getByRole('button', { name: '提交注册申请' }).click()

    await vi.waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith(
        expect.stringContaining('申请未提交')
      )
    )
  })
})
