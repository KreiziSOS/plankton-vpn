export function generateAmneziaConfig(baseConfig: string) {
    return `
  # Amnezia VPN
  # Anti-blocking profile
  
  ${baseConfig}
  
  # Amnezia options
  Jc = 4
  Jmin = 40
  Jmax = 70
  S1 = 15
  S2 = 25
  H1 = 123456789
  H2 = 987654321
  H3 = 555555555
  H4 = 777777777
  `
  }