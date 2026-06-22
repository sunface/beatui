import { createContext } from 'react'
import { type SectionNavItem } from './section-top-nav'

export const SectionNavItemsContext = createContext<SectionNavItem[]>([])
