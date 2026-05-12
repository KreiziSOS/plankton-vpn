# Plankton VPN MVP Plan

## Version 1
- Landing page EN/RU
- TonConnect wallet connect
- Jetton balance check
- Telegram bot account linking
- WireGuard peer creation via wg-easy
- 30-day free access for holders
- Admin user list and revoke access

## User Flow
1. User opens website
2. Connects TON wallet
3. Backend verifies wallet ownership and $PLANKTON balance
4. User opens Telegram bot
5. Backend links Telegram ID and wallet
6. Backend creates WireGuard peer
7. User receives QR code and .conf file
8. Access expires after 30 days unless extended

## Security
- Never ask for seed phrase
- Store VPN configs encrypted
- Revoke expired peers
- Log admin actions
- Rate-limit config requests
