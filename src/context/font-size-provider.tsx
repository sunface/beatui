import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { fontSizes, type FontSize } from '@/lib/font-sizes'

const FONT_SIZE_COOKIE_NAME = 'font_size'
const FONT_SIZE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const DEFAULT_FONT_SIZE: FontSize = 'lg'

type FontSizeContextType = {
  defaultFontSize: FontSize
  fontSize: FontSize
  setFontSize: (fontSize: FontSize) => void
  resetFontSize: () => void
}

const FontSizeContext = createContext<FontSizeContextType | null>(null)

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, _setFontSize] = useState<FontSize>(() => {
    const saved = getCookie(FONT_SIZE_COOKIE_NAME)
    return saved && fontSizes.includes(saved as FontSize)
      ? (saved as FontSize)
      : DEFAULT_FONT_SIZE
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [fontSize])

  const setFontSize = (fontSize: FontSize) => {
    setCookie(FONT_SIZE_COOKIE_NAME, fontSize, FONT_SIZE_COOKIE_MAX_AGE)
    _setFontSize(fontSize)
  }

  const resetFontSize = () => {
    removeCookie(FONT_SIZE_COOKIE_NAME)
    _setFontSize(DEFAULT_FONT_SIZE)
  }

  return (
    <FontSizeContext
      value={{
        defaultFontSize: DEFAULT_FONT_SIZE,
        fontSize,
        setFontSize,
        resetFontSize,
      }}
    >
      {children}
    </FontSizeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFontSize = () => {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}
