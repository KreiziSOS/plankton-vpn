export async function createVpnPeer(userId: string) {
  // TODO: integrate wg-easy API or direct WireGuard peer management.
  return {
    peerId: `peer_${userId}`,
    config: '[Interface]\nPrivateKey = ...\nAddress = 10.8.0.2/24\n\n[Peer]\nPublicKey = ...',
    qrText: 'wireguard-config-placeholder'
  };
}
export async function revokeVpnPeer(peerId: string) {
  console.log('Revoking peer', peerId);
  return true;
}
