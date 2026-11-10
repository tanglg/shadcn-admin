import '@/styles/index.css'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { ThemeProvider, useTheme } from '@/context/theme-provider'
import { Card } from '@/components/ui/card'
import { UsersActionDialog } from '@/features/users/components/users-action-dialog'
import { type User } from '@/features/users/data/schema'

function GlassFixture() {
  const { glassEnabled, glassOpacity, setGlassEnabled, setGlassOpacity } =
    useTheme()

  return (
    <>
      <button onClick={() => setGlassEnabled(!glassEnabled)}>
        Toggle glass
      </button>
      <input
        type='range'
        min={50}
        max={100}
        value={glassOpacity}
        onChange={(event) => setGlassOpacity(Number(event.target.value))}
        aria-label='Glass opacity'
      />
      <header data-slot='header' data-testid='glass-header'>
        Header
      </header>
      <Card data-testid='glass-card'>Glass content</Card>
    </>
  )
}

function getElement(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (!element) throw new Error(`Expected ${selector} to render`)
  return element
}

function getColorAlpha(color: string) {
  const match = color.match(/\/\s*([\d.]+)\)$/)
  return match ? Number(match[1]) : 1
}

const MOCK_USER: User = {
  id: 'alex_uuid',
  firstName: 'Alex',
  lastName: 'Smith',
  username: 'alex_smith',
  email: 'alex@smith.com',
  phoneNumber: '+19999999999',
  status: 'active',
  role: 'superadmin',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-02-02'),
}

describe('optional glass effect', () => {
  beforeEach(() => {
    window.localStorage.removeItem('glass_enabled')
    window.localStorage.removeItem('glass_opacity')
    window.localStorage.removeItem('theme_id')
    document.documentElement.style.removeProperty('--glass-opacity')
    document.documentElement.removeAttribute('data-glass')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('light', 'dark')
  })

  it('applies translucent blur to cards only while enabled', async () => {
    const screen = await render(
      <ThemeProvider>
        <GlassFixture />
      </ThemeProvider>
    )
    const card = getElement("[data-testid='glass-card']")

    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('data-glass')).toBe('false')
    )
    const solidBackground = getComputedStyle(card).backgroundColor
    expect(getComputedStyle(card).backdropFilter).toBe('none')

    await userEvent.click(screen.getByRole('button', { name: 'Toggle glass' }))
    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute('data-glass')).toBe('true')
      expect(getComputedStyle(card).backdropFilter).toContain('blur')
      expect(getComputedStyle(card).backgroundColor).not.toBe(solidBackground)
    })

    const enabledAlpha = getColorAlpha(getComputedStyle(card).backgroundColor)
    getElement("[aria-label='Glass opacity']").focus()
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue('--glass-opacity')
      ).toBe('50%')
      expect(window.localStorage.getItem('glass_opacity')).toBe('50')
      expect(
        getColorAlpha(getComputedStyle(card).backgroundColor)
      ).toBeLessThan(enabledAlpha)
    })

    await userEvent.click(screen.getByRole('button', { name: 'Toggle glass' }))
    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute('data-glass')).toBe('false')
      expect(getComputedStyle(card).backdropFilter).toBe('none')
      expect(getComputedStyle(card).backgroundColor).toBe(solidBackground)
    })
  })

  it('keeps Command Center opaque when off and restores its dark glass when on', async () => {
    window.localStorage.setItem('theme_id', 'command-center')
    const screen = await render(
      <ThemeProvider>
        <GlassFixture />
      </ThemeProvider>
    )
    const header = getElement("[data-testid='glass-header']")

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe(
        'command-center'
      )
      expect(document.documentElement.getAttribute('data-glass')).toBe('false')
    })
    const solidBackground = getComputedStyle(header).backgroundColor
    expect(solidBackground).toBe('rgb(28, 27, 26)')
    expect(getComputedStyle(header).backdropFilter).toBe('none')

    await userEvent.click(screen.getByRole('button', { name: 'Toggle glass' }))
    await vi.waitFor(() => {
      expect(getComputedStyle(header).backdropFilter).toContain('blur')
      expect(getComputedStyle(header).backgroundColor).toBe(
        'rgba(0, 0, 0, 0.7)'
      )
    })
  })

  it('gives the Edit User dialog a visibly translucent glass surface', async () => {
    window.localStorage.setItem('glass_enabled', 'true')
    await render(
      <ThemeProvider>
        <UsersActionDialog currentRow={MOCK_USER} open onOpenChange={vi.fn()} />
      </ThemeProvider>
    )
    const dialog = getElement("[data-slot='dialog-content']")

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute('data-glass')).toBe('true')
      expect(getComputedStyle(dialog).backdropFilter).toContain('blur')
      expect(
        getColorAlpha(getComputedStyle(dialog).backgroundColor)
      ).toBeLessThan(0.85)
    })
  })
})
