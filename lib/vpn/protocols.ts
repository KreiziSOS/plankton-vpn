export type VPNProtocol = 'wireguard' | 'amnezia' | 'openvpn'

export const VPN_PROTOCOLS = {
  wireguard: {
    id: 'wireguard',
    title: 'WireGuard',
    description: 'Fast • Lightweight • Default',
  },

  amnezia: {
    id: 'amnezia',
    title: 'Amnezia VPN',
    description: 'Better bypass • Anti-blocking • Smart routing',
  },

  openvpn: {
    id: 'openvpn',
    title: 'OpenVPN',
    description: 'TCP 443 • Fallback • Optional obfuscation',
  },
}
