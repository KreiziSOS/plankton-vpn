import type { LocaleData } from './en'

const zh: LocaleData = {
  welcome:
    `🐋 *欢迎使用 Plankton VPN*\n\n` +
    `为 $PLANKTON 持有者提供的私人 VPN 访问。\n\n` +
    `⚡ 高速 WireGuard 服务器\n` +
    `🔐 使用 TON 或 $PLANKTON 支付\n` +
    `🌍 在任何国家均可使用\n` +
    `🎁 持有 1M\\+ $PLANKTON 免费使用\n\n` +
    `点击 *Launch App* 开始。`,

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
  vpn_access_active:   '✅ 已激活',
  vpn_access_inactive: '❌ 未激活',

  no_devices:            '暂无设备。',
  device_item:           '设备：{name}\n\n状态：{status}\n\nVPN IP：{ip}',
  device_status_active:  '已启用',
  device_status_disabled:'已禁用',
  device_disabled:       '设备已禁用。',
  device_enabled:        '设备已启用。',
  device_deleted:        '设备已删除。',

  not_enough_plankton: '$PLANKTON 余额不足，无法获得免费访问。\n请订阅以获得付费访问。',
  vpn_creation_failed: 'VPN 创建失败，请重试。',
  vpn_ready:           'VPN 已就绪。\n\n设备：\n{name}',

  // Chinese text uses 。(U+3002) which is not a MarkdownV2 special char — no escaping needed.
  // Only ASCII . in wireguard\.com and \.conf needs escaping.
  help_text:
    `*❓ 如何获得免费 VPN？*\n` +
    `在钱包中持有 1,000,000 $PLANKTON。在应用中连接钱包，然后点击"检查访问权限"。\n\n` +
    `*💳 如何支付订阅？*\n` +
    `打开应用，进入 VPN 标签页，选择套餐。使用 TON 或 $PLANKTON 支付。\n\n` +
    `*📱 支持哪些设备？*\n` +
    `任何支持 WireGuard 的设备：iOS、Android、Windows、macOS、Linux。\n\n` +
    `*⬇️ 如何安装 WireGuard？*\n` +
    `从 wireguard\\.com 下载官方应用，然后导入应用生成的 \\.conf 文件。\n\n` +
    `*🔧 VPN 无法使用——该怎么办？*\n` +
    `尝试重新下载配置文件。如果问题持续存在，请联系下方客服。`,

  language_choose: '请选择语言：',
  language_set:    '✅ 语言已设置为中文',
}

export default zh
