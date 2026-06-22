import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { DEFAULT_SKIN, skins, type Skin } from '@/lib/skins'

const SKIN_COOKIE_NAME = 'skin'
const SKIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type SkinContextType = {
  defaultSkin: Skin
  skin: Skin
  setSkin: (skin: Skin) => void
  resetSkin: () => void
}

const SkinContext = createContext<SkinContextType | null>(null)

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, _setSkin] = useState<Skin>(() => {
    const savedSkin = getCookie(SKIN_COOKIE_NAME)
    return savedSkin && skins.includes(savedSkin) ? savedSkin : DEFAULT_SKIN
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', skin)
  }, [skin])

  const setSkin = (skin: Skin) => {
    setCookie(SKIN_COOKIE_NAME, skin, SKIN_COOKIE_MAX_AGE)
    _setSkin(skin)
  }

  const resetSkin = () => {
    removeCookie(SKIN_COOKIE_NAME)
    _setSkin(DEFAULT_SKIN)
  }

  return (
    <SkinContext
      value={{ defaultSkin: DEFAULT_SKIN, skin, setSkin, resetSkin }}
    >
      {children}
    </SkinContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSkin = () => {
  const context = useContext(SkinContext)
  if (!context) {
    throw new Error('useSkin must be used within a SkinProvider')
  }
  return context
}
