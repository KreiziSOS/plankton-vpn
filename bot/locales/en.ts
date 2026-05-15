const en = {
  // /start photo caption — MarkdownV2
  welcome:
    `🐋 *Welcome to Plankton VPN*\n\n` +
    `Private VPN access for $PLANKTON holders\\.\n\n` +
    `⚡ Fast WireGuard servers\n` +
    `🔐 Pay with TON or $PLANKTON\n` +
    `🌍 Works in any country\n` +
    `🎁 Free for holders of 1M\\+ $PLANKTON\n\n` +
    `Tap *Launch App* to start\\.`,

  // Inline keyboard buttons
  btn_launch_app:       'Launch App',
  btn_my_vpn:           'My VPN',
  btn_devices:          'Devices',
  btn_subscription:     'Subscription',
  btn_help:             'Help',
  btn_language:         '🌐 Language',
  btn_contact_support:  'Contact Support',
  btn_download_config:  'Download Config',
  btn_disable:          'Disable',
  btn_enable:           'Enable',
  btn_delete:           'Delete',

  // /link
  link_usage:        'Usage: /link YOUR_WALLET_ADDRESS',
  link_already_taken:'This wallet is already linked to another Telegram account.',
  link_success:      'Wallet linked.\n\n{wallet}',

  // My VPN status
  wallet_not_linked:   'Wallet not linked.\n\nUse: /link YOUR_WALLET',
  vpn_status_header:
    'Plankton VPN Status\n\n' +
    'Wallet:\n{wallet}\n\n' +
    '$PLANKTON:\n{balance}\n\n' +
    'Access:\n{access}\n\n' +
    'Devices:\n{devices}',
  vpn_access_active:       '✅ Active',
  vpn_access_inactive:     '❌ Inactive',
  vpn_access_holder:       '✅ PLANKTON holder (1M+)',
  vpn_access_subscription: '✅ Active until {date}',
  vpn_access_both:         '✅ PLANKTON holder + Active until {date}',

  // Devices list
  no_devices:            'No devices yet.',
  device_item:           'Device: {name}\n\nStatus: {status}\n\nVPN IP: {ip}',
  device_status_active:  'Active',
  device_status_disabled:'Disabled',
  device_disabled:       'Device disabled.',
  device_enabled:        'Device enabled.',
  device_deleted:        'Device deleted.',

  // Create VPN
  not_enough_plankton: 'Not enough $PLANKTON for free access.\nUse Subscription to get paid access.',
  no_access: 'Access denied.\n\nYou need 1,000,000+ $PLANKTON or an active subscription to use VPN.',
  vpn_creation_failed: 'VPN creation failed. Please try again.',
  vpn_ready:           'VPN access ready.\n\nDevice:\n{name}',

  // Help FAQ — MarkdownV2
  help_text:
    `*❓ How do I get free VPN access?*\n` +
    `Hold 1,000,000 $PLANKTON in your wallet\\. Connect your wallet in the app and tap Check Access\\.\n\n` +
    `*💳 How do I pay for a subscription?*\n` +
    `Open the app, go to the VPN tab, and choose a plan\\. Pay with TON or $PLANKTON\\.\n\n` +
    `*📱 Which devices are supported?*\n` +
    `Any device with WireGuard: iOS, Android, Windows, macOS, Linux\\.\n\n` +
    `*⬇️ How do I install WireGuard?*\n` +
    `Download the official app from wireguard\\.com and import the \\.conf file from the app\\.\n\n` +
    `*🔧 VPN isn't working — what should I do?*\n` +
    `Try re\\-downloading the config file\\. If the issue persists, contact our support\\.`,

  // Language picker
  language_choose: 'Choose your language:',
  language_set:    '✅ Language set to English',
}

export default en
export type LocaleData = typeof en
export type LocaleKey  = keyof LocaleData
