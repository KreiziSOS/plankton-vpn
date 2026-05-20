const DEFAULT_HOST = 'vpn.plankton.ceo'
const DEFAULT_PORT = '443'

function block(name: string, value?: string) {
  const clean = value?.trim()
  return clean ? `<${name}>\n${clean}\n</${name}>` : ''
}

export function generateOpenVpnConfig(deviceName: string) {
  const template = process.env.OPENVPN_CLIENT_TEMPLATE
  if (template?.trim()) {
    return `${template.replaceAll('{{DEVICE_NAME}}', deviceName).trim()}\n`
  }

  const host = process.env.OPENVPN_HOST || DEFAULT_HOST
  const port = process.env.OPENVPN_PORT || DEFAULT_PORT
  const proto = process.env.OPENVPN_PROTO || 'tcp-client'
  const obfsEnabled = process.env.OPENVPN_OBFS_ENABLED === 'true'
  const obfsProxy = process.env.OPENVPN_OBFS_PROXY
  const ca = process.env.OPENVPN_CA_CERT
  const cert = process.env.OPENVPN_CLIENT_CERT
  const key = process.env.OPENVPN_CLIENT_KEY
  const tlsCrypt = process.env.OPENVPN_TLS_CRYPT_KEY

  const lines = [
    'client',
    'dev tun',
    `proto ${proto}`,
    `remote ${host} ${port}`,
    'resolv-retry infinite',
    'nobind',
    'persist-key',
    'persist-tun',
    'remote-cert-tls server',
    'auth SHA256',
    'cipher AES-256-GCM',
    'data-ciphers AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305',
    'verb 3',
    'mute-replay-warnings',
    'auth-nocache',
    'keepalive 10 60',
    'reneg-sec 0',
    `setenv PLANKTON_DEVICE ${deviceName}`,
  ]

  if (obfsEnabled) {
    lines.push('tls-version-min 1.2')
    lines.push('tls-cipher TLS-ECDHE-ECDSA-WITH-AES-256-GCM-SHA384:TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384')
    if (obfsProxy) lines.push(`socks-proxy ${obfsProxy}`)
  }

  lines.push(block('ca', ca))
  lines.push(block('cert', cert))
  lines.push(block('key', key))
  lines.push(block('tls-crypt', tlsCrypt))

  return `${lines.filter(Boolean).join('\n')}\n`
}
