import type { LocaleData } from './en'

const zh: LocaleData = {
  welcome:
    `🐋 *欢迎使用 Plankton VPN*\n\n` +
    `Plankton VPN 当前处于 holders\\-only beta。\n\n` +
    `$PLANKTON 持有者可以使用。\n` +
    `支持协议：WireGuard、Amnezia、OpenVPN。\n` +
    `付费套餐和推荐计划即将推出。\n\n` +
    `打开 Mini App 连接钱包并创建 VPN 配置。`,

  btn_launch_app:       'Launch App',
  btn_my_vpn:           '我的 VPN',
  btn_devices:          '设备',
  btn_subscription:     '订阅',
  btn_help:             '帮助',
  btn_language:         '🌐 语言',
  btn_support:          'Support',
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
    `*Plankton VPN 是什么？*\n` +
    `面向 $PLANKTON 社区的私密 VPN，目前处于 holders\\-only beta。\n\n` +
    `*现在谁可以使用？*\n` +
    `拥有有效持有者权限的 $PLANKTON 持有者。\n\n` +
    `*持有者访问如何工作？*\n` +
    `打开 Mini App，连接钱包，检查权限，然后创建 VPN 配置。\n\n` +
    `*支持哪些协议？*\n` +
    `WireGuard、Amnezia 和 OpenVPN。\n\n` +
    `*应该选择哪个协议？*\n` +
    `WireGuard：最快。\n` +
    `Amnezia：推荐用于受限网络。\n` +
    `OpenVPN：兼容备用模式。\n\n` +
    `*VPN 无法连接？*\n` +
    `先尝试 Amnezia，如果网络限制更严格，再使用 OpenVPN。\n\n` +
    `*连接后无法上网？*\n` +
    `断开连接，删除配置，重新生成新配置并再次导入。\n\n` +
    `付费套餐：即将推出。\n` +
    `推荐计划：即将推出。\n\n` +
    `客服: https://t\\.me/plankton\\_support`,

  language_choose: '请选择语言：',
  language_set:    '✅ 语言已设置为中文',
}

export default zh
