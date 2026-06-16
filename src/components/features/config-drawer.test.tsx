import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { getCookie, setCookie } from '@/lib/cookies'
import { DirectionProvider } from '@/context/direction-provider'
import { FontSizeProvider } from '@/context/font-size-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SkinProvider } from '@/context/skin-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from './config-drawer'

async function renderConfigDrawer({
  sidebarDefaultOpen = true,
}: {
  sidebarDefaultOpen?: boolean
} = {}) {
  return await render(
    <DirectionProvider>
      <ThemeProvider>
        <SkinProvider>
          <FontSizeProvider>
            <LayoutProvider>
              <SidebarProvider defaultOpen={sidebarDefaultOpen}>
                <ConfigDrawer />
              </SidebarProvider>
            </LayoutProvider>
          </FontSizeProvider>
        </SkinProvider>
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

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('dir')
    document.documentElement.removeAttribute('data-skin')
    document.documentElement.removeAttribute('data-font-size')
  })

  it('opens the drawer and renders the sections', async () => {
    const screen = await renderConfigDrawer()

    await openDrawer(screen)

    const drawer = screen.getByRole('dialog', { name: /theme settings/i })

    await expect.element(drawer).toBeInTheDocument()
    await expect
      .element(drawer)
      .toHaveAttribute('data-component', 'config-drawer')

    await expect.element(drawer.getByText(/^Theme$/i)).toBeInTheDocument()
    await expect.element(drawer.getByText(/^Skin$/i)).toBeInTheDocument()
    await expect.element(drawer.getByText(/^Font Size$/i)).toBeInTheDocument()
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

  describe('skin preference', () => {
    it('applies claude skin to <html data-skin> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(
        screen.getByRole('radio', { name: /switch to claude skin/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-skin')).toBe(
          'claude'
        )
      )
      expect(getCookie('skin')).toBe('claude')
    })
  })

  describe('font size preference', () => {
    it('applies medium font size to <html data-font-size> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(
        screen.getByRole('radio', { name: /set font size medium/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-font-size')).toBe(
          'md'
        )
      )
      expect(getCookie('font_size')).toBe('md')
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

    it('resets skin via section control after choosing claude', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /switch to claude skin/i })
      )
      await vi.waitFor(() => expect(getCookie('skin')).toBe('claude'))

      await userEvent.click(
        screen.getByRole('button', { name: /reset skin to default/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-skin')).toBe(
          'default'
        )
      )
      expect(getCookie('skin')).toBe('default')
    })

    it('resets font size via section control after choosing medium', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /set font size medium/i })
      )
      await vi.waitFor(() => expect(getCookie('font_size')).toBe('md'))

      await userEvent.click(
        screen.getByRole('button', { name: /reset font size to default/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('data-font-size')).toBe(
          'lg'
        )
      )
      expect(getCookie('font_size')).toBe('lg')
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

  it('reset restores defaults across sidebar/theme/skin/layout/direction', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })

    await openDrawer(screen)

    await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
    await userEvent.click(
      screen.getByRole('radio', { name: /switch to claude skin/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /set font size medium/i })
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
    await vi.waitFor(() => expect(getCookie('skin')).toBe('claude'))
    await vi.waitFor(() => expect(getCookie('font_size')).toBe('md'))
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
    await vi.waitFor(() => expect(getCookie('skin')).toBeUndefined())
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('data-skin')).toBe('default')
    )
    await vi.waitFor(() => expect(getCookie('font_size')).toBeUndefined())
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('data-font-size')).toBe('lg')
    )
    await vi.waitFor(() => expect(getCookie('layout_variant')).toBe('inset'))
    await vi.waitFor(() => expect(getCookie('layout_collapsible')).toBe('icon'))
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    )
  })
})
