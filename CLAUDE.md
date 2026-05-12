# PLANKTON VPN — STATUS DOC

## Project Overview

PLANKTON VPN is a Telegram-native VPN ecosystem built around the $PLANKTON token on TON.
The product combines:

* holder utility
* Telegram Mini App
* TON Connect
* WireGuard VPN infrastructure
* subscription system
* future TON/$PLANKTON monetization

Goal:
Create a premium crypto-native VPN product where:

* holders receive free VPN access
* non-holders can purchase subscriptions using TON or $PLANKTON

---

# CURRENT STATUS

## Infrastructure

✅ Vercel deployment working
✅ PostgreSQL database connected
✅ Prisma ORM configured
✅ TON Connect integrated
✅ Telegram Mini App working
✅ WireGuard backend connected
✅ VPN config generation working
✅ Download .conf working
✅ Multi-language support working
✅ Telegram profile/avatar integration working

---

# HOLDER SYSTEM

## Current Logic

✅ Wallet connect via TON Connect
✅ $PLANKTON balance checking
✅ Minimum hold requirement:
1,000,000 $PLANKTON

✅ Access auto-unlocks for holders
✅ Access auto-lock architecture prepared
✅ Hourly re-check architecture planned

---

# VPN SYSTEM

## Current State

✅ WireGuard chosen as core protocol
✅ Official WireGuard install flow added
✅ Config generation working
✅ Config download working
✅ Telegram-native onboarding working

## Planned

* Multi-server support
* Region selection
* Traffic analytics
* Auto device revoke
* Device management

---

# SUBSCRIPTION SYSTEM

## Current

✅ Prisma subscription models created
✅ Payment model created
✅ Expiration system created
✅ Active subscription checking works
✅ Mock payment activation works

## Plans

1 Month

* $3 TON
* $2 equivalent in $PLANKTON

3 Months

* discounted pricing planned

12 Months

* best value pricing planned

---

# PAYMENT SYSTEM

## Current

✅ Payment API works
✅ Payment records stored in DB
✅ TON payment architecture connected
✅ TON Connect transaction flow started
✅ Mock activation after payment works

## Current Problem

⚠️ TON payment buttons currently trigger incorrect UI/payment flow in Mini App.

Most likely:

* old cached frontend
* wrong handler attached
* access re-check interfering with flow

---

# UI/UX STATUS

## Current

✅ Premium dark UI
✅ Mobile-first layout
✅ Bottom navigation
✅ Splash screen
✅ Telegram-style profile section
✅ WireGuard section
✅ Community links section

## Needs Improvement

* VPN pricing cards
* clearer discount labels
* “Best Value” markers
* payment UX
* subscription status UX
* loading states
* animated transitions

---

# MULTI LANGUAGE

## Supported

✅ English
✅ Russian
✅ Ukrainian
✅ Chinese

## Needs

* pricing translations
* payment status translations
* guide polish
* error message translations

---

# SECURITY / ARCHITECTURE

## Current

✅ Backend separated from frontend
✅ Database persistence works
✅ TON wallet auth works

## Planned

* Real blockchain tx verification
* TON tx parsing
* Jetton verification
* Anti-abuse system
* Fraud prevention
* Rate limits
* Device limits

---

# OPEN SOURCE STATUS

## Current Position

Product uses:

* WireGuard (open source)
* wg-easy (open source)

But:

* ecosystem
* UI
* backend
* holder logic
* payment system
* access architecture

remain proprietary/private.

---

# BRANDING

## Current

✅ Plankton branding integrated
✅ Telegram/X links integrated
✅ WireGuard branding integrated

## Remaining

* favicon
* OG image
* metadata
* Twitter preview cards
* SEO tags

---

# NEXT PRIORITIES

## HIGH PRIORITY

1. Fix TON payment button flow
2. Replace mock payment activation
3. Add real TON blockchain verification
4. Add real $PLANKTON payment verification
5. Auto activate after tx confirmation

## MEDIUM PRIORITY

6. Subscription UI polish
7. Discount labels
8. Best value cards
9. Auto renew system
10. Expired subscription revoke cron

## FUTURE

11. Multi-server scaling
12. Admin dashboard
13. Referral system
14. Analytics
15. Promo codes
16. Traffic statistics
17. Dedicated VPN app

---

# FINAL PRODUCT VISION

PLANKTON VPN aims to become:

* a Telegram-native VPN SaaS
* a real utility ecosystem for $PLANKTON
* a monetized TON product
* a scalable WireGuard infrastructure
* a crypto-native subscription platform
