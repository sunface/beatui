import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'

/**
 * Single-icon day/night toggle: shows the sun in light mode, the moon in
 * dark mode; clicking always sets an explicit 'light' / 'dark'. The
 * 'system' preference is configured from the Theme Settings drawer instead.
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  /* Update theme-color meta tag when the resolved theme changes */
  useEffect(() => {
    const themeColor = isDark ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [isDark])

  return (
    <Button
      data-component='theme-switch'
      variant='ghost'
      size='icon'
      className='scale-95 rounded-full'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
    </Button>
  )
}
