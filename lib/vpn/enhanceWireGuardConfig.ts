export function enhanceWireGuardConfig(config: string) {
  const lines = config.replace(/\r\n/g, '\n').trim().split('\n')
  const result: string[] = []
  let section: 'interface' | 'peer' | 'other' = 'other'
  let interfaceInsertAt = -1
  let peerInsertAt = -1
  let hasDns = false
  let hasMtu = false
  let hasKeepalive = false
  let hasEndpoint = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^\[Interface\]$/i.test(trimmed)) {
      section = 'interface'
      interfaceInsertAt = result.length + 1
      result.push(line)
      continue
    }

    if (/^\[Peer\]$/i.test(trimmed)) {
      section = 'peer'
      peerInsertAt = result.length + 1
      result.push(line)
      continue
    }

    if (/^\[.+\]$/.test(trimmed)) {
      section = 'other'
      result.push(line)
      continue
    }

    if (section === 'interface' && /^DNS\s*=/i.test(trimmed)) {
      hasDns = true
      result.push('DNS = 1.1.1.1, 8.8.8.8')
      continue
    }

    if (section === 'interface' && /^MTU\s*=/i.test(trimmed)) {
      hasMtu = true
      result.push('MTU = 1280')
      continue
    }

    if (section === 'peer' && /^PersistentKeepalive\s*=/i.test(trimmed)) {
      hasKeepalive = true
      result.push('PersistentKeepalive = 25')
      continue
    }

    if (section === 'peer' && /^Endpoint\s*=/i.test(trimmed)) {
      hasEndpoint = true
      result.push('Endpoint = vpn.plankton.ceo:51820')
      continue
    }

    result.push(line)
  }

  const interfaceLines = []
  if (!hasDns) interfaceLines.push('DNS = 1.1.1.1, 8.8.8.8')
  if (!hasMtu) interfaceLines.push('MTU = 1280')
  if (interfaceLines.length && interfaceInsertAt >= 0) {
    result.splice(interfaceInsertAt, 0, ...interfaceLines)
    if (peerInsertAt > interfaceInsertAt) peerInsertAt += interfaceLines.length
  }

  const peerLines = []
  if (!hasEndpoint) peerLines.push('Endpoint = vpn.plankton.ceo:51820')
  if (!hasKeepalive) peerLines.push('PersistentKeepalive = 25')
  if (peerLines.length && peerInsertAt >= 0) {
    result.splice(peerInsertAt, 0, ...peerLines)
  }

  return `${result.join('\n')}\n`
}
