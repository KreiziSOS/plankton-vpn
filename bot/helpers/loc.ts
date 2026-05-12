import en, { type LocaleKey } from '../locales/en'
import ru from '../locales/ru'
import ua from '../locales/ua'
import zh from '../locales/zh'

const locales: Record<string, typeof en> = { en, ru, ua, zh }

export function loc(lang: string, key: LocaleKey): string {
  return (locales[lang] ?? locales.en)[key] ?? en[key]
}
