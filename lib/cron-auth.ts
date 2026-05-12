import crypto from 'crypto'

// HMAC-wrapping both sides before timingSafeEqual ensures the comparison
// always runs on equal-length buffers regardless of input length, so neither
// a length mismatch nor the character-by-character loop leaks timing info.
function safeEqual(a: string, b: string): boolean {
  const key = Buffer.alloc(32)
  const ha = crypto.createHmac('sha256', key).update(a).digest()
  const hb = crypto.createHmac('sha256', key).update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

// Priority: Authorization: Bearer <token> → ?secret=<token>
export function verifyCronRequest(req: Request, secret: string): boolean {
  const header = req.headers.get('authorization')
  const provided = header?.startsWith('Bearer ')
    ? header.slice(7)
    : new URL(req.url).searchParams.get('secret')

  return !!provided && safeEqual(provided, secret)
}
