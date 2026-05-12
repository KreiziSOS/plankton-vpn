import { prisma } from '../../lib/prisma'

const SUPPORTED = ['en', 'ru', 'ua', 'zh'] as const
export type Lang = typeof SUPPORTED[number]

export async function getUserLanguage(
  ctx: { from?: { id?: number; language_code?: string } }
): Promise<Lang> {
  const telegramId = ctx.from?.id ? String(ctx.from.id) : null

  if (telegramId) {
    try {
      const user = await prisma.user.findFirst({
        where: { telegramId },
        select: { language: true },
      })
      if (user?.language && (SUPPORTED as readonly string[]).includes(user.language)) {
        return user.language as Lang
      }
    } catch {}
  }

  const code = ctx.from?.language_code?.slice(0, 2) ?? 'en'
  return (SUPPORTED as readonly string[]).includes(code) ? (code as Lang) : 'en'
}
