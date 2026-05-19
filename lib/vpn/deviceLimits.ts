import { prisma } from '@/lib/prisma'

export async function getActiveSubscriptionDeviceLimit(wallet: string) {
  const activeSub = await prisma.subscription.findFirst({
    where: {
      wallet,
      active: true,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: 'desc' },
  })

  if (!activeSub) return null

  if (activeSub.plan === 'ONE_MONTH') return 2
  if (activeSub.plan === 'THREE_MONTHS') return 3
  if (activeSub.plan === 'TWELVE_MONTHS') return 5

  return null
}

export async function getDeviceLimit(wallet: string) {
  const subLimit = await getActiveSubscriptionDeviceLimit(wallet)

  return subLimit ?? 1
}
