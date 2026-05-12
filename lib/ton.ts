export async function checkPlanktonBalance(walletAddress: string) {
  // TODO: use TonAPI/TonCenter to fetch jetton balance for PLANKTON_JETTON_ADDRESS.
  // Return normalized human balance.
  console.log('Checking wallet', walletAddress);
  return { ok: true, balance: '0', eligible: false };
}
