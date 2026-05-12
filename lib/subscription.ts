import { prisma } from '@/lib/prisma'

export async function hasActiveSubscription(wallet: string) {
  const sub = await prisma.subscription.findFirst({
    where: {
      wallet,
      active: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  return !!sub
}