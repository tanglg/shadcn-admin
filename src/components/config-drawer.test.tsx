import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { getCookie, setCookie } from '@/lib/cookies'
import { DirectionProvider } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from './config-drawer'

const BRAND_COLOR_THEMES = [
  { id: 'garden-fresh', name: '田园鲜绿' },
  { id: 'homeui', name: 'HomeUI' },
  { id: 'schemablue', name: 'SchemaBlue' },
  { id: 'mistral', name: 'Mistral AI' },
  { id: 'supabase', name: 'Supabase' },
  { id: 'noirluxe', name: 'NoirLuxe' },
  { id: 'softro', name: 'Softro SaaS' },
  { id: 'duolingo', name: 'Duolingo' },
  { id: 'cloudflare', name: 'Cloudflare' },
  { id: 'hubspot', name: 'HubSpot' },
  { id: 'canva', name: 'Canva' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'skylearn', name: 'Skylearn' },
  { id: 'questui', name: 'QuestUI' },
] as const

async function renderConfigDrawer({
  sidebarDefaultOpen = true,
}: {
  sidebarDefaultOpen?: boolean
} = {}) {
  return await render(
    <DirectionProvider>
      <ThemeProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <ConfigDrawer />
          </SidebarProvider>
        </LayoutProvider>
      </ThemeProvider>
    </DirectionProvider>
  )
}

async function openDrawer(screen: RenderResult) {
  await userEvent.click(
    screen.getByRole('button', { name: /^Open theme settings$/i })
  )
  await expect
    .element(screen.getByText(/^Theme Settings$/i))
    .toBeInTheDocument()
}

describe('ConfigDrawer (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    clearCookies()
    window.localStorage.removeItem('theme_id')
    window.localStorage.removeItem('glass_enabled')
    window.localStorage.removeItem('glass_opacity')

    document.documentElement.style.removeProperty('--glass-opacity')
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-glass')
    document.documentElement.removeAttribute('dir')
  })

  it('opens the drawer and renders the sections', async () => {
    const screen = await renderConfigDrawer()

    await openDrawer(screen)

    const drawer = screen.getByRole('dialog', { name: /theme settings/i })

    await expect.element(drawer).toBeInTheDocument()

    await expect.element(drawer.getByText(/^Theme$/i)).toBeInTheDocument()
    await expect.element(drawer.getByText(/^Color Theme$/i)).toBeInTheDocument()
    await expect.element(drawer.getByText(/^Effects$/i)).toBeInTheDocument()
    await expect.element(drawer.getByText(/^Layout$/i)).toBeInTheDocument()
    await expect
      .element(drawer.getByText(/^Sidebar$/i).first())
      .toBeInTheDocument()
    await expect.element(drawer.getByText(/^Direction$/i)).toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('button', {
          name: /reset all settings to default values/i,
        })
      )
      .toBeInTheDocument()
  })

  describe('theme preference', () => {
    it('applies light theme to <html> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(
        screen.getByRole('radio', { name: /select light/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.classList.contains('light')).toBe(true)
      )
      expect(getCookie('vite-ui-theme')).toBe('light')
    })

    it('applies dark theme to <html> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
      await vi.waitFor(() =>
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      )
      expect(getCookie('vite-ui-theme')).toBe('dark')
    })

    it('applies system theme: stores cookie and applies a resolved light or dark class', async () => {
      // Pre-seed light so mounted theme is not system; re-selecting System alone would not fire setTheme.
      setCookie('vite-ui-theme', 'light')

      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select system/i })
      )
      await vi.waitFor(() => expect(getCookie('vite-ui-theme')).toBe('system'))
      await vi.waitFor(() => {
        const root = document.documentElement
        const hasLight = root.classList.contains('light')
        const hasDark = root.classList.contains('dark')
        expect(hasLight !== hasDark).toBe(true)
      })
    })
  })

  describe('color theme preference', () => {
    it('applies Retro Blue to <html> and localStorage', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select retro blue/i })
      )

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'retro-blue'
        )
      )
      expect(window.localStorage.getItem('theme_id')).toBe('retro-blue')
    })

    it('layers Retro Blue with dark mode', async () => {
      setCookie('vite-ui-theme', 'dark')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select retro blue/i })
      )

      await vi.waitFor(() => {
        const root = document.documentElement
        expect(root.classList.contains('dark')).toBe(true)
        expect(root.getAttribute('data-theme')).toBe('retro-blue')
      })
    })

    it('restores a stored Retro Blue preference', async () => {
      window.localStorage.setItem('theme_id', 'retro-blue')
      await renderConfigDrawer()

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'retro-blue'
        )
      )
    })

    it('applies Claude to <html> and localStorage', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select claude/i })
      )

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'claude'
        )
      )
      expect(window.localStorage.getItem('theme_id')).toBe('claude')
    })

    it('layers Claude with dark mode', async () => {
      setCookie('vite-ui-theme', 'dark')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select claude/i })
      )

      await vi.waitFor(() => {
        const root = document.documentElement
        expect(root.classList.contains('dark')).toBe(true)
        expect(root.getAttribute('data-theme')).toBe('claude')
      })
    })

    it('restores a stored Claude preference', async () => {
      window.localStorage.setItem('theme_id', 'claude')
      await renderConfigDrawer()

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'claude'
        )
      )
    })

    it('applies Command Center to <html> and localStorage', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select command center/i })
      )

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'command-center'
        )
      )
      expect(window.localStorage.getItem('theme_id')).toBe('command-center')
    })

    it('layers Command Center with dark mode', async () => {
      setCookie('vite-ui-theme', 'dark')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select command center/i })
      )

      await vi.waitFor(() => {
        const root = document.documentElement
        expect(root.classList.contains('dark')).toBe(true)
        expect(root.getAttribute('data-theme')).toBe('command-center')
      })
    })

    it('restores a stored Command Center preference', async () => {
      window.localStorage.setItem('theme_id', 'command-center')
      await renderConfigDrawer()

      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'command-center'
        )
      )
    })

    describe.each(BRAND_COLOR_THEMES)('$name color theme', ({ id, name }) => {
      it('applies the palette to <html> and localStorage', async () => {
        const screen = await renderConfigDrawer()
        await openDrawer(screen)

        await userEvent.click(
          screen.getByRole('radio', { name: new RegExp(`select ${name}`, 'i') })
        )

        await vi.waitFor(() =>
          expect(document.documentElement.getAttribute('data-theme')).toBe(id)
        )
        expect(window.localStorage.getItem('theme_id')).toBe(id)
      })

      it('layers the palette with dark mode', async () => {
        setCookie('vite-ui-theme', 'dark')
        const screen = await renderConfigDrawer()
        await openDrawer(screen)

        await userEvent.click(
          screen.getByRole('radio', { name: new RegExp(`select ${name}`, 'i') })
        )

        await vi.waitFor(() => {
          const root = document.documentElement
          expect(root.classList.contains('dark')).toBe(true)
          expect(root.getAttribute('data-theme')).toBe(id)
        })
      })

      it('restores the stored palette preference', async () => {
        window.localStorage.setItem('theme_id', id)
        await renderConfigDrawer()

        await vi.waitFor(() =>
          expect(document.documentElement.getAttribute('data-theme')).toBe(id)
        )
      })
    })

    it('resets Retro Blue via the color theme section control', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select retro blue/i })
      )
      await vi.waitFor(() =>
        expect(window.localStorage.getItem('theme_id')).toBe('retro-blue')
      )

      await userEvent.click(
        screen.getByRole('button', { name: /reset color theme to default/i })
      )

      await vi.waitFor(() => {
        expect(window.localStorage.getItem('theme_id')).toBeNull()
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
      })
    })
  })

  describe('glass effect preference', () => {
    it('defaults to off and persists both toggle states', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      const toggle = screen.getByRole('switch', { name: /frosted glass/i })

      await expect.element(toggle).toHaveAttribute('aria-checked', 'false')
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-glass')).toBe(
          'false'
        )
      )

      await userEvent.click(toggle)
      await vi.waitFor(() => {
        expect(document.documentElement.getAttribute('data-glass')).toBe('true')
        expect(window.localStorage.getItem('glass_enabled')).toBe('true')
      })
      await expect.element(toggle).toHaveAttribute('aria-checked', 'true')

      await userEvent.click(toggle)
      await vi.waitFor(() => {
        expect(document.documentElement.getAttribute('data-glass')).toBe(
          'false'
        )
        expect(window.localStorage.getItem('glass_enabled')).toBe('false')
      })
    })

    it('updates and persists opacity in real time', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      const slider = screen.getByRole('slider', { name: /glass opacity/i })

      await expect.element(slider).toBeDisabled()
      await userEvent.click(
        screen.getByRole('switch', { name: /frosted glass/i })
      )
      await expect.element(slider).toBeEnabled()

      const input = document.querySelector<HTMLInputElement>('#glass-opacity')
      if (!input) throw new Error('Expected the opacity slider to render')
      input.focus()
      await userEvent.keyboard('{Home}')

      await vi.waitFor(() => {
        expect(
          document.documentElement.style.getPropertyValue('--glass-opacity')
        ).toBe('50%')
        expect(window.localStorage.getItem('glass_opacity')).toBe('50')
      })
      await expect.element(slider).toHaveValue('50')

      await userEvent.keyboard('{ArrowRight}')
      await vi.waitFor(() => {
        expect(
          document.documentElement.style.getPropertyValue('--glass-opacity')
        ).toBe('51%')
        expect(window.localStorage.getItem('glass_opacity')).toBe('51')
      })
      await expect.element(slider).toHaveValue('51')
    })

    it('restores the stored opacity preference', async () => {
      window.localStorage.setItem('glass_enabled', 'true')
      window.localStorage.setItem('glass_opacity', '67')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      const slider = screen.getByRole('slider', { name: /glass opacity/i })
      await expect.element(slider).toHaveValue('67')
      await vi.waitFor(() =>
        expect(
          document.documentElement.style.getPropertyValue('--glass-opacity')
        ).toBe('67%')
      )
    })

    it('restores the enabled preference', async () => {
      window.localStorage.setItem('glass_enabled', 'true')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await expect
        .element(screen.getByRole('switch', { name: /frosted glass/i }))
        .toHaveAttribute('aria-checked', 'true')
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-glass')).toBe('true')
      )
    })

    it('resets the preference with the global reset control', async () => {
      window.localStorage.setItem('glass_enabled', 'true')
      window.localStorage.setItem('glass_opacity', '67')
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset all settings to default values/i,
        })
      )

      await vi.waitFor(() => {
        expect(window.localStorage.getItem('glass_enabled')).toBeNull()
        expect(window.localStorage.getItem('glass_opacity')).toBeNull()
        expect(document.documentElement.getAttribute('data-glass')).toBe(
          'false'
        )
        expect(
          document.documentElement.style.getPropertyValue('--glass-opacity')
        ).toBe('82%')
      })
    })
  })

  describe('sidebar variant', () => {
    it('selecting floating updates layout_variant cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookie('layout_variant')).toBe('floating')
      )
    })

    it('selecting sidebar updates layout_variant cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /^select sidebar$/i })
      )
      await vi.waitFor(() =>
        expect(getCookie('layout_variant')).toBe('sidebar')
      )
    })

    it('selecting inset updates layout_variant cookie after another variant', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookie('layout_variant')).toBe('floating')
      )

      await userEvent.click(
        screen.getByRole('radio', { name: /select inset/i })
      )
      await vi.waitFor(() => expect(getCookie('layout_variant')).toBe('inset'))
    })
  })

  it('selecting full layout sets collapsible to offcanvas and closes sidebar', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })
    await openDrawer(screen)

    await userEvent.click(
      screen.getByRole('radio', { name: /select full layout/i })
    )
    await vi.waitFor(() =>
      expect(getCookie('layout_collapsible')).toBe('offcanvas')
    )
    await vi.waitFor(() => expect(getCookie('sidebar_state')).toBe('false'))
  })

  describe('section reset buttons', () => {
    it('resets theme via section control after choosing dark', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
      await vi.waitFor(() => expect(getCookie('vite-ui-theme')).toBe('dark'))

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset theme preference to default/i,
        })
      )
      await vi.waitFor(() => expect(getCookie('vite-ui-theme')).toBe('system'))
    })

    it('resets direction via section control after choosing RTL', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select right to left/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset text direction to default/i,
        })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      )
      expect(getCookie('dir')).toBe('ltr')
    })

    it('resets sidebar style via section control after choosing floating', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookie('layout_variant')).toBe('floating')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset sidebar style to default/i,
        })
      )
      await vi.waitFor(() => expect(getCookie('layout_variant')).toBe('inset'))
    })

    it('resets layout via section control after choosing compact', async () => {
      const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select compact/i })
      )
      await vi.waitFor(() => expect(getCookie('sidebar_state')).toBe('false'))

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset layout options to default/i,
        })
      )
      await vi.waitFor(() => expect(getCookie('sidebar_state')).toBe('true'))
      await vi.waitFor(() =>
        expect(getCookie('layout_collapsible')).toBe('icon')
      )
    })
  })

  it('changes direction and applies it to <html dir>', async () => {
    const screen = await renderConfigDrawer()

    await openDrawer(screen)

    await userEvent.click(
      screen.getByRole('radio', { name: /select right to left/i })
    )
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    )
    expect(getCookie('dir')).toBe('rtl')
  })

  it('updates layout: selecting non-default closes sidebar and changes layout cookie', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })

    await openDrawer(screen)

    await expect
      .element(screen.getByRole('radio', { name: /select default/i }))
      .toHaveAttribute('data-state', 'checked')

    await userEvent.click(
      screen.getByRole('radio', { name: /select compact/i })
    )

    await vi.waitFor(() => expect(getCookie('sidebar_state')).toBe('false'))
    await vi.waitFor(() => expect(getCookie('layout_collapsible')).toBe('icon'))
  })

  it('reset restores defaults across sidebar/theme/layout/direction', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })

    await openDrawer(screen)

    await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
    await userEvent.click(
      screen.getByRole('radio', { name: /select retro blue/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /select right to left/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /select floating/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /select full layout/i })
    )

    await vi.waitFor(() => expect(getCookie('vite-ui-theme')).toBe('dark'))
    await vi.waitFor(() =>
      expect(window.localStorage.getItem('theme_id')).toBe('retro-blue')
    )
    await vi.waitFor(() => expect(getCookie('dir')).toBe('rtl'))
    await vi.waitFor(() => expect(getCookie('layout_variant')).toBe('floating'))
    await vi.waitFor(() =>
      expect(getCookie('layout_collapsible')).toBe('offcanvas')
    )

    await userEvent.click(
      screen.getByRole('button', {
        name: /reset all settings to default values/i,
      })
    )

    await vi.waitFor(() => expect(getCookie('sidebar_state')).toBe('true'))
    await vi.waitFor(() => expect(getCookie('dir')).toBeUndefined())
    await vi.waitFor(() => expect(getCookie('vite-ui-theme')).toBeUndefined())
    await vi.waitFor(() => {
      expect(window.localStorage.getItem('theme_id')).toBeNull()
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    })
    await vi.waitFor(() => expect(getCookie('layout_variant')).toBe('inset'))
    await vi.waitFor(() => expect(getCookie('layout_collapsible')).toBe('icon'))
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    )
  })
})
