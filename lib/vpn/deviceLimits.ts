import { prisma } from '@/lib/prisma'

export async function getDeviceLimit(wallet: string) {
  const activeSub = await prisma.subscription.findFirst({
    where: {
      wallet,
      active: true,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: 'desc' },
  })

  if (!activeSub) return 1

  if (activeSub.plan === 'ONE_MONTH') return 2
  if (activeSub.plan === 'THREE_MONTHS') return 3
  if (activeSub.plan === 'TWELVE_MONTHS') return 5

  return 1
}