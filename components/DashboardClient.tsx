'use client'

import { useEffect, useState } from 'react'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'

type Device = {
  id: string
  name: string
  address?: string
  enabled: boolean
  expiresAt?: string
  createdAt: string
}

export default function DashboardClient({
  locale,
}: {
  locale: string
}) {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()

  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [devices, setDevices] = useState<Device[]>([])

  const ru = locale === 'ru'

  async function loadDevices(walletAddress: string) {
    try {
      const res = await fetch(
        `/api/vpn/devices?wallet=${walletAddress}`
      )

      const data = await res.json()

      if (data.ok) {
        setDevices(data.devices)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    async function init() {
      if (!wallet) {
        setDevices([])
        return
      }

      try {
        setLoading(true)

        const res = await fetch(
          `/api/check-plankton?wallet=${wallet.account.address}`
        )

        const data = await res.json()

        setHasAccess(data.hasAccess)
        setBalance(data.balance || '0')

        await loadDevices(wallet.account.address)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [wallet])

  async function createVpnAccess() {
    if (!wallet) return

    try {
      const name = `plankton-${wallet.account.address.slice(
        2,
        10
      )}`

      await fetch('/api/vpn/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: wallet.account.address,
        }),
      })

      await loadDevices(wallet.account.address)

      window.location.href = `/api/vpn/download?name=${name}`
    } catch (e) {
      console.error(e)
      alert('VPN creation failed')
    }
  }

  async function deviceAction(
    deviceId: string,
    action: string
  ) {
    if (!wallet) return

    try {
      await fetch('/api/vpn/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          action,
        }),
      })

      await loadDevices(wallet.account.address)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="container">
      <nav className="nav">
        <div className="brand">PLANKTON VPN</div>

        <a href={`/${locale}`}>
          {ru ? 'Назад' : 'Back'}
        </a>
      </nav>

      <section className="section">
        <h1>
          <span className="blue">
            {ru ? 'КАБИНЕТ' : 'DASHBOARD'}
          </span>
        </h1>

        <div className="grid3">
          {/* WALLET */}
          <div className="card">
            <h3>
              {ru ? 'Кошелёк' : 'Wallet'}
            </h3>

            <button
              className="btn btnMain"
              style={{ margin: '16px 0' }}
              onClick={() => {
                if (wallet) {
                  tonConnectUI.disconnect()
                } else {
                  tonConnectUI.openModal()
                }
              }}
            >
              {wallet
                ? ru
                  ? 'Отключить'
                  : 'Disconnect'
                : ru
                ? 'Подключить'
                : 'Connect Wallet'}
            </button>

            <p
              style={{
                wordBreak: 'break-all',
                opacity: 0.7,
              }}
            >
              {wallet
                ? wallet.account.address
                : 'Not connected'}
            </p>
          </div>

          {/* BALANCE */}
          <div className="card">
            <h3>$PLANKTON</h3>

            {loading ? (
              <p>Checking...</p>
            ) : (
              <>
                <p>
                  Balance:{' '}
                  <strong>{balance}</strong>
                </p>

                <p
                  style={{
                    marginTop: 10,
                    color: hasAccess
                      ? '#37d67a'
                      : '#ff6767',
                  }}
                >
                  {hasAccess
                    ? 'VPN Access Active'
                    : 'No Access'}
                </p>
              </>
            )}
          </div>

          {/* VPN */}
          <div className="card">
            <h3>VPN</h3>

            <p>
              {hasAccess
                ? 'Active'
                : 'Inactive'}
            </p>

            {hasAccess && (
              <button
                className="btn btnMain"
                style={{ marginTop: 20 }}
                onClick={createVpnAccess}
              >
                Create VPN Access
              </button>
            )}
          </div>
        </div>

        {/* DEVICES */}
        {wallet && (
          <div
            className="card"
            style={{
              marginTop: 30,
            }}
          >
            <h2
              style={{
                marginBottom: 20,
              }}
            >
              Devices
            </h2>

            {devices.length === 0 ? (
              <p>No devices yet</p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {devices.map((device) => (
                  <div
                    key={device.id}
                    style={{
                      padding: 20,
                      borderRadius: 20,
                      background:
                        'rgba(255,255,255,0.03)',
                      border:
                        '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <strong>{device.name}</strong>

                      <span
                        style={{
                          color: device.enabled
                            ? '#37d67a'
                            : '#ff6767',
                        }}
                      >
                        {device.enabled
                          ? 'Active'
                          : 'Disabled'}
                      </span>
                    </div>

                    <p
                      style={{
                        marginTop: 12,
                        opacity: 0.7,
                      }}
                    >
                      VPN IP: {device.address}
                    </p>

                    <p
                      style={{
                        marginTop: 8,
                        opacity: 0.7,
                      }}
                    >
                      Expires:{' '}
                      {device.expiresAt
                        ? new Date(
                            device.expiresAt
                          ).toLocaleDateString()
                        : 'No limit'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        marginTop: 18,
                        flexWrap: 'wrap',
                      }}
                    >
                      <a
                        href={`/api/vpn/download?name=${device.name}`}
                        className="btn btnMain"
                      >
                        Download
                      </a>

                      {device.enabled ? (
                        <button
                          className="btn"
                          onClick={() =>
                            deviceAction(
                              device.id,
                              'disable'
                            )
                          }
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          className="btn"
                          onClick={() =>
                            deviceAction(
                              device.id,
                              'enable'
                            )
                          }
                        >
                          Enable
                        </button>
                      )}

                      <button
                        className="btn"
                        onClick={() =>
                          deviceAction(
                            device.id,
                            'delete'
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}