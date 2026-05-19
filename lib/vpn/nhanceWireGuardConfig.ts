export function enhanceWireGuardConfig(config: string) {
    let result = config
  
    if (!result.includes('DNS =')) {
      result = result.replace(
        '[Interface]',
        '[Interface]\nDNS = 1.1.1.1, 8.8.8.8'
      )
    }
  
    if (!result.includes('MTU =')) {
      result = result.replace(
        '[Interface]',
        '[Interface]\nMTU = 1280'
      )
    }
  
    if (!result.includes('PersistentKeepalive =')) {
      result = result.replace(
        '[Peer]',
        '[Peer]\nPersistentKeepalive = 25'
      )
    }
  
    return result
  }