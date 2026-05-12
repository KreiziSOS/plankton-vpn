import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

function verifyTelegramInitData(initData: string) {
  if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN missing')

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')

  if (!hash) return null

  params.delete('hash')

  // Reject initData older than 24 hours to block replay attacks.
  const authDate = Number(params.get('auth_date') ?? '0')
  if (!authDate || Date.now() / 1000 - authDate > 86_400) return null

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest()

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (calculatedHash !== hash) return null

  const userRaw = params.get('user')
  if (!userRaw) return null

  return JSON.parse(userRaw)
}

export async function POST(req: Request) {
  try {
    const { initData, wallet } = await req.json()

    if (!initData || !wallet) {
      return NextResponse.json(
        { ok: false, error: 'initData and wallet required' },
        { status: 400 }
      )
    }

    const telegramUser = verifyTelegramInitData(initData)

    if (!telegramUser?.id) {
      return NextResponse.json(
        { ok: false, error: 'Invalid Telegram auth' },
        { status: 401 }
      )
    }

    const user = await prisma.user.upsert({
      where: { wallet },
      update: {
        telegramId: String(telegramUser.id),
      },
      create: {
        wallet,
        telegramId: String(telegramUser.id),
      },
    })

    return NextResponse.json({
      ok: true,
      user,
      telegram: {
        id: telegramUser.id,
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || 'Server error' },
      { status: 500 }
    )
  }
}