export const defaultLocale = 'tr'
export const locales = ['en', 'tr']
export const localeNames = {
  en: 'English',
  tr: 'Türkçe'
}

export function getOptions(lng = defaultLocale) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng
  }
}
