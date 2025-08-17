const supportLanguages = [
  'en-US',
  'zh-Hans'
] as const

export type Languages = typeof supportLanguages[number]

let language: Languages = 'en-US'

export const isSupportLanguage = (lang: string): lang is Languages => {
  return (supportLanguages as readonly string[]).includes(lang)
}

export const setLanguage = (lang: string) => {
  if (isSupportLanguage(lang)) {
    language = lang
  } else {
    console.warn(`Unsupported language: ${lang}, fallback to en-US`)
  }
}

export const i18nRender = (record: Record<Languages, string>) => () => trimIndent(record[language]).trimStart()

export const trimIndent = (str: string) => {
  const lines = str.split('\n')
  const indent = lines.reduce((minIndent, line) => {
    const trimmedLine = line.replace(/^\s+/, '')
    if (trimmedLine && (!minIndent || line.length - trimmedLine.length < minIndent)) {
      return line.length - trimmedLine.length
    }
    return minIndent
  }, Infinity)
  return lines
    .map(line => line.slice(indent))
    .join('\n')
}
