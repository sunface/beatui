// Interface font sizes: applied as <html data-font-size>, with the actual
// rem-scale rules living in styles/framework.css. 'md' is the browser
// default scale (16px) and ships as the factory setting.
export const fontSizes = ['sm', 'md', 'lg'] as const

export type FontSize = (typeof fontSizes)[number]
