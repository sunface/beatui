import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { getCookie, setCookie } from '@/lib/cookies'
import { ThemeProvider } from '@/context/theme-provider'
import { ThemeSwitch } from './theme-switch'

async function renderThemeSwitch() {
  return await render(
    <ThemeProvider>
      <ThemeSwitch />
    </ThemeProvider>
  )
}

describe('ThemeSwitch', () => {
  beforeEach(() => {
    clearCookies()
    document.documentElement.classList.remove('light', 'dark')
  })

  it('clicking the sun switches to dark: html class + explicit cookie', async () => {
    setCookie('vite-ui-theme', 'light')
    const screen = await renderThemeSwitch()

    await userEvent.click(
      screen.getByRole('button', { name: /switch to dark mode/i })
    )

    await vi.waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    )
    expect(getCookie('vite-ui-theme')).toBe('dark')
    await expect
      .element(screen.getByRole('button', { name: /switch to light mode/i }))
      .toBeInTheDocument()
  })

  it('clicking the moon switches back to light', async () => {
    setCookie('vite-ui-theme', 'dark')
    const screen = await renderThemeSwitch()

    await userEvent.click(
      screen.getByRole('button', { name: /switch to light mode/i })
    )

    await vi.waitFor(() =>
      expect(document.documentElement.classList.contains('light')).toBe(true)
    )
    expect(getCookie('vite-ui-theme')).toBe('light')
  })

  it('under system theme, clicking writes an explicit choice', async () => {
    // No cookie → theme is 'system'; clicking must persist light/dark, not system.
    const screen = await renderThemeSwitch()

    await userEvent.click(screen.getByRole('button'))

    await vi.waitFor(() =>
      expect(['light', 'dark']).toContain(getCookie('vite-ui-theme'))
    )
  })
})
