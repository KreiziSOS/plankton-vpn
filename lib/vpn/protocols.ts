export type VPNProtocol = 'wireguard' | 'amnezia'

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
}