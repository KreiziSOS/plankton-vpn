const en = {
  // /start photo caption — MarkdownV2
  welcome:
    `🐋 *Welcome to Plankton VPN*\n\n` +
    `Plankton VPN is currently in holders\\-only beta\\.\n\n` +
    `Access is currently available only for wallets holding at least 1,000,000 $PLANKTON\\.\n` +
    `Supported protocols: WireGuard, Amnezia, OpenVPN\\.\n` +
    `Paid plans and the referral program are coming soon\\.\n\n` +
    `Open the Mini App to connect your wallet and create VPN configs\\.`,

  // Inline keyboard buttons
  btn_launch_app:       'Launch App',
  btn_my_vpn:           'My VPN',
  btn_devices:          'Devices',
  btn_subscription:     'Subscription',
  btn_help:             'Help',
  btn_language:         '🌐 Language',
  btn_support:          'Support',
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
  not_enough_plankton: 'Not enough $PLANKTON for holder access.\nAccess is currently available only for wallets holding at least 1,000,000 $PLANKTON.',
  no_access: 'Access denied.\n\nAccess is currently available only for wallets holding at least 1,000,000 $PLANKTON.',
  vpn_creation_failed: 'VPN creation failed. Please try again.',
  vpn_ready:           'VPN access ready.\n\nDevice:\n{name}',

  // Help FAQ — MarkdownV2
  help_text:
    `*Plankton VPN Help*\n\n` +
    `*What is Plankton VPN?*\n` +
    `A private VPN for the $PLANKTON community, now in holders\\-only beta\\.\n\n` +
    `*Who can use it now?*\n` +
    `Wallets holding at least 1,000,000 $PLANKTON\\.\n\n` +
    `*What if I have fewer tokens?*\n` +
    `Access will not be activated yet\\. Paid plans are coming soon\\.\n\n` +
    `*How does holder access work?*\n` +
    `Open the Mini App, connect your wallet, check access, then create VPN configs\\.\n\n` +
    `*Which protocols are available?*\n` +
    `WireGuard, Amnezia, and OpenVPN\\.\n\n` +
    `*Which protocol should I choose?*\n` +
    `WireGuard: fastest\\.\n` +
    `Amnezia: recommended for restrictive networks\\.\n` +
    `OpenVPN: compatibility fallback mode\\.\n\n` +
    `*VPN does not connect?*\n` +
    `Try Amnezia first, then OpenVPN if the network is restrictive\\.\n\n` +
    `*Internet does not work after connecting?*\n` +
    `Disconnect, delete the profile, generate a fresh config, and import it again\\.\n\n` +
    `Paid plans: Coming Soon\\.\n` +
    `Referral program: Coming Soon\\.\n\n` +
    `Support: https://t\\.me/plankton\\_support`,

  // Language picker
  language_choose: 'Choose your language:',
  language_set:    '✅ Language set to English',
}

export default en
export type LocaleData = typeof en
export type LocaleKey  = keyof LocaleData
