import type { LocaleData } from './en'

const zh: LocaleData = {
  welcome:
    `🐋 *欢迎使用 Plankton VPN*\n\n` +
    `为 $PLANKTON 持有者提供的私人 VPN 访问。\n\n` +
    `⚡ 高速 WireGuard 服务器\n` +
    `🔐 使用 TON 或 $PLANKTON 支付\n` +
    `🌍 在任何国家均可使用\n` +
    `🎁 持有 1M\\+ $PLANKTON 免费使用\n\n` +
    `所有 VPN 管理都在 Web App 中完成。\n` +
    `点击 *Launch App* 连接钱包、检查访问权限、购买订阅、管理设备并下载配置。`,

  btn_launch_app:       'Launch App',
  btn_my_vpn:           '我的 VPN',
  btn_devices:          '设备',
  btn_subscription:     '订阅',
  btn_help:             '帮助',
  btn_language:         '🌐 语言',
  btn_contact_support:  '联系客服',
  btn_download_config:  '下载配置',
  btn_disable:          '禁用',
  btn_enable:           '启用',
  btn_delete:           '删除',

  link_usage:        '用法：/link 你的钱包地址',
  link_already_taken:'该钱包已绑定到其他 Telegram 账户。',
  link_success:      '钱包已绑定。\n\n{wallet}',

  wallet_not_linked:   '钱包未绑定。\n\n请使用：/link 你的钱包地址',
  vpn_status_header:
    'Plankton VPN 状态\n\n' +
    '钱包：\n{wallet}\n\n' +
    '$PLANKTON：\n{balance}\n\n' +
    '访问状态：\n{access}\n\n' +
    '设备数：\n{devices}',
  vpn_access_active:       '✅ 已激活',
  vpn_access_inactive:     '❌ 未激活',
  vpn_access_holder:       '✅ PLANKTON 持有者 (1M+)',
  vpn_access_subscription: '✅ 有效至 {date}',
  vpn_access_both:         '✅ PLANKTON 持有者 + 有效至 {date}',

  no_devices:            '暂无设备。',
  device_item:           '设备：{name}\n\n状态：{status}\n\nVPN IP：{ip}',
  device_status_active:  '已启用',
  device_status_disabled:'已禁用',
  device_disabled:       '设备已禁用。',
  device_enabled:        '设备已启用。',
  device_deleted:        '设备已删除。',

  not_enough_plankton: '$PLANKTON 余额不足，无法获得免费访问。\n请订阅以获得付费访问。',
  no_access: '访问被拒绝。\n\n需要持有 1,000,000+ $PLANKTON 或拥有有效订阅才能使用 VPN。',
  vpn_creation_failed: 'VPN 创建失败，请重试。',
  vpn_ready:           'VPN 已就绪。\n\n设备：\n{name}',

  // Chinese text uses 。(U+3002) which is not a MarkdownV2 special char — no escaping needed.
  // Only ASCII . in wireguard\.com and \.conf needs escaping.
  help_text:
    `*Plankton VPN 帮助*\n\n` +
    `所有 VPN 管理都在 Web App 中完成。\n\n` +
    `打开 *Launch App* 连接钱包、检查访问权限、购买订阅、管理设备，并下载 WireGuard 或 Amnezia 配置。\n\n` +
    `客服: https://t\\.me/plankton_support`,

  language_choose: '请选择语言：',
  language_set:    '✅ 语言已设置为中文',
}

export default zh
