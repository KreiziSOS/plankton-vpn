const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price' +
  '?ids=ceo-plankton,the-open-network&vs_currencies=usd'

const TTL_MS = 60_000

let cache: { ton: number; plankton: number; fetchedAt: number } | null = null

async function fetchFromCoinGecko(): Promise<{ ton: number; plankton: number }> {
  const res = await fetch(COINGECKO_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`)

  const data = await res.json()
  const ton      = data['the-open-network']?.usd as number | undefined
  const plankton = data['ceo-plankton']?.usd     as number | undefined

  if (!ton || !plankton) {
    throw new Error(`CoinGecko response missing prices: ${JSON.stringify(data)}`)
  }

  return { ton, plankton }
}

export async function getRates(): Promise<{
  ton: number
  plankton: number
  fetchedAt: number
}> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache
  }

  let ton: number
  let plankton: number

  try {
    const fresh = await fetchFromCoinGecko()
    ton      = fresh.ton
    plankton = fresh.plankton
    console.log(`[rates] updated: TON=$${ton}, PLANKTON=$${plankton}`)
  } catch (err) {
    const fbTon      = process.env.TON_USD_FALLBACK
    const fbPlankton = process.env.PLANKTON_USD_FALLBACK

    if (!fbTon || !fbPlankton) {
      throw new Error(`CoinGecko unavailable and TON_USD_FALLBACK/PLANKTON_USD_FALLBACK not set: ${err}`)
    }

    ton      = Number(fbTon)
    plankton = Number(fbPlankton)

    if (!ton || !plankton || isNaN(ton) || isNaN(plankton)) {
      throw new Error(`Fallback rates are zero or NaN (TON_USD_FALLBACK=${fbTon}, PLANKTON_USD_FALLBACK=${fbPlankton})`)
    }

    console.warn(`[rates] CoinGecko unavailable — using .env fallback: TON=$${ton}, PLANKTON=$${plankton}`)
  }

  cache = { ton, plankton, fetchedAt: Date.now() }
  return cache
}

export async function getTonUsdRate():      Promise<number> { return (await getRates()).ton }
export async function getPlanktonUsdRate(): Promise<number> { return (await getRates()).plankton }
