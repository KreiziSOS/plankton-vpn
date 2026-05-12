import { getTonUsdRate, getPlanktonUsdRate } from '@/lib/rates'

export const VPN_PRICING = {
  ONE_MONTH:     { tonUsd: 3,  planktonUsd: 2,  days: 30  },
  THREE_MONTHS:  { tonUsd: 7,  planktonUsd: 5,  days: 90  },
  TWELVE_MONTHS: { tonUsd: 20, planktonUsd: 14, days: 365 },
}

// Returns the token nano-amount for the given plan and currency, calculated
// from the live USD rate. Math.ceil ensures the user never under-pays due to
// rounding. The result is locked in Payment.amountToken at create time.
export async function calculateNano(
  plan: keyof typeof VPN_PRICING,
  currency: 'TON' | 'PLANKTON'
): Promise<string> {
  const pricing  = VPN_PRICING[plan]
  const usdPrice = currency === 'TON' ? pricing.tonUsd : pricing.planktonUsd
  const rate     = currency === 'TON' ? await getTonUsdRate() : await getPlanktonUsdRate()
  return String(Math.ceil((usdPrice / rate) * 1e9))
}
