'use client'

import { useEffect, useState } from 'react'
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react'
import { Address, beginCell, toNano } from '@ton/core'

const BUY_URL =
  'https://dedust.io/swap/TON/EQBLl2zeXFnwt2MsCw_LOEcgP5zC0VRWTeMA7NMNErLrOijA?amount=100000000000'

const WIREGUARD_URL = 'https://www.wireguard.com/install/'
const TG_CHANNEL = 'https://t.me/plankton_info'
const TG_CHAT = 'https://t.me/ceo_plankton'
const X_URL = 'https://x.com/CEO_Plankton'

type Tab = 'home' | 'vpn' | 'guide' | 'profile'
type Lang = 'en' | 'ru' | 'ua' | 'zh'
type Protocol = 'wireguard' | 'amnezia'

declare global {
  interface Window {
    Telegram?: any
  }
}

const TEXT = {
  en: {
    title: 'PLANKTON VPN',
    subtitle: 'Private WireGuard VPN access for $PLANKTON holders.',
    hold: 'Hold 1,000,000 $PLANKTON to unlock free VPN access.',
    check: 'Check Access',
    checking: 'Checking...',
    active: 'VPN Access Active',
    locked: 'Access Locked',
    buy: 'BUY $PLANKTON',
    install: 'Install WireGuard',
    generate: 'Generate Config',
    download: 'Download Config',
    home: 'Home',
    vpn: 'VPN',
    guide: 'Guide',
    profile: 'Profile',
    links: 'Community',
    channel: 'Telegram Channel',
    chat: 'Telegram Chat',
    twitter: 'X / Twitter',
    dashboard: 'Profile Dashboard',
    wallet: 'Wallet',
    guideTitle: 'How to activate VPN',
    step1: 'Install the official WireGuard app.',
    step2: 'Generate your Plankton VPN config.',
    step3: 'Open WireGuard and import the downloaded .conf file.',
    step4: 'Turn the VPN tunnel ON.',
    wgOfficial: 'Open WireGuard Official',
    plans: 'VPN Plans',
    subActive: 'Subscription Active',
    protocol: 'VPN Protocol',
    wireguardDesc: 'Fast • Lightweight • Default',
    amneziaDesc: 'Better bypass • Anti-blocking • Smart routing',
    comingSoon: 'Coming soon',
  },
  ru: {
    title: 'PLANKTON VPN',
    subtitle: 'Приватный WireGuard VPN доступ для холдеров $PLANKTON.',
    hold: 'Холди 1,000,000 $PLANKTON, чтобы получить бесплатный VPN.',
    check: 'Проверить доступ',
    checking: 'Проверка...',
    active: 'VPN доступ активен',
    locked: 'Доступ закрыт',
    buy: 'КУПИТЬ $PLANKTON',
    install: 'Установить WireGuard',
    generate: 'Создать конфиг',
    download: 'Скачать конфиг',
    home: 'Главная',
    vpn: 'VPN',
    guide: 'Гайд',
    profile: 'Профиль',
    links: 'Комьюнити',
    channel: 'Telegram канал',
    chat: 'Telegram чат',
    twitter: 'X / Twitter',
    dashboard: 'Панель профиля',
    wallet: 'Кошелёк',
    guideTitle: 'Как активировать VPN',
    step1: 'Установи официальное приложение WireGuard.',
    step2: 'Создай конфиг Plankton VPN.',
    step3: 'Открой WireGuard и импортируй скачанный .conf файл.',
    step4: 'Включи VPN-туннель.',
    wgOfficial: 'Открыть WireGuard Official',
    plans: 'VPN тарифы',
    subActive: 'Подписка активна',
    protocol: 'VPN протокол',
    wireguardDesc: 'Быстрый • Лёгкий • По умолчанию',
    amneziaDesc: 'Лучше обход • Антиблокировка • Smart routing',
    comingSoon: 'Скоро',
  },
  ua: {
    title: 'PLANKTON VPN',
    subtitle: 'Приватний WireGuard VPN доступ для холдерів $PLANKTON.',
    hold: 'Тримай 1,000,000 $PLANKTON, щоб отримати безкоштовний VPN.',
    check: 'Перевірити доступ',
    checking: 'Перевірка...',
    active: 'VPN доступ активний',
    locked: 'Доступ закрито',
    buy: 'КУПИТИ $PLANKTON',
    install: 'Встановити WireGuard',
    generate: 'Створити конфіг',
    download: 'Завантажити конфіг',
    home: 'Головна',
    vpn: 'VPN',
    guide: 'Гайд',
    profile: 'Профіль',
    links: 'Спільнота',
    channel: 'Telegram канал',
    chat: 'Telegram чат',
    twitter: 'X / Twitter',
    dashboard: 'Панель профілю',
    wallet: 'Гаманець',
    guideTitle: 'Як активувати VPN',
    step1: 'Встанови офіційний застосунок WireGuard.',
    step2: 'Створи конфіг Plankton VPN.',
    step3: 'Відкрий WireGuard та імпортуй завантажений .conf файл.',
    step4: 'Увімкни VPN-тунель.',
    wgOfficial: 'Відкрити WireGuard Official',
    plans: 'VPN тарифи',
    subActive: 'Підписка активна',
    protocol: 'VPN протокол',
    wireguardDesc: 'Швидкий • Легкий • За замовчуванням',
    amneziaDesc: 'Кращий обхід • Антиблокування • Smart routing',
    comingSoon: 'Скоро',
  },
  zh: {
    title: 'PLANKTON VPN',
    subtitle: '为 $PLANKTON 持有者提供的 WireGuard VPN。',
    hold: '持有 1,000,000 $PLANKTON 即可解锁免费 VPN。',
    check: '检查权限',
    checking: '检查中...',
    active: 'VPN 已激活',
    locked: '访问受限',
    buy: '购买 $PLANKTON',
    install: '安装 WireGuard',
    generate: '生成配置',
    download: '下载配置',
    home: '首页',
    vpn: 'VPN',
    guide: '指南',
    profile: '我的',
    links: '社区',
    channel: 'Telegram 频道',
    chat: 'Telegram 群聊',
    twitter: 'X / Twitter',
    dashboard: '个人面板',
    wallet: '钱包',
    guideTitle: '如何激活 VPN',
    step1: '安装官方 WireGuard 应用。',
    step2: '生成你的 Plankton VPN 配置。',
    step3: '打开 WireGuard 并导入下载的 .conf 文件。',
    step4: '开启 VPN 隧道。',
    wgOfficial: '打开 WireGuard 官网',
    plans: 'VPN 套餐',
    subActive: '订阅已激活',
    protocol: 'VPN 协议',
    wireguardDesc: '快速 • 轻量 • 默认',
    amneziaDesc: '更好绕过 • 抗封锁 • 智能路由',
    comingSoon: '即将推出',
  },
}

async function pollVerify(
  url: string,
  body: object,
  retries = 8,
  delayMs = 2500,
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, delayMs))
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok && data.verified) return true
      if (data.failed) return false
    } catch {}
  }
  return false
}

export default function MiniAppClient() {
  const wallet = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const [tab, setTab] = useState<Tab>('vpn')
  const [lang, setLang] = useState<Lang>('en')
  const [telegramUser, setTelegramUser] = useState<any>(null)
  const [showSplash, setShowSplash] = useState(true)

  const t = TEXT[lang]

  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)
  const [status, setStatus] = useState(t.locked)
  const [configUrl, setConfigUrl] = useState('')
  const [forcePlans, setForcePlans] = useState(false)
  const [pricingData, setPricingData] = useState<any>(null)
  const [protocol, setProtocol] = useState<Protocol>('wireguard')

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => { if (data.plans) setPricingData(data) })
      .catch(() => {})
  }, [])

  // Route to plans tab when opened via bot subscription button or deep link
  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search).get('startapp')
    const tgParam  = window.Telegram?.WebApp?.initDataUnsafe?.start_param
    if ((urlParam ?? tgParam) === 'plans') {
      setTab('vpn')
      setForcePlans(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.touchAction = 'manipulation'
    document.body.style.overflowX = 'hidden'

    const timer = setTimeout(() => setShowSplash(false), 1800)

    function readTelegramUser() {
      const tg = window.Telegram?.WebApp
      if (!tg) return null

      tg.ready()
      tg.expand()

      let user = tg.initDataUnsafe?.user

      if (!user && tg.initData) {
        try {
          const params = new URLSearchParams(tg.initData)
          const rawUser = params.get('user')
          if (rawUser) user = JSON.parse(rawUser)
        } catch {}
      }

      if (user) {
        localStorage.setItem('telegram_user', JSON.stringify(user))
        return user
      }

      try {
        const saved = localStorage.getItem('telegram_user')
        if (saved) return JSON.parse(saved)
      } catch {}

      return null
    }

    let attempts = 0

    const interval = setInterval(() => {
      attempts += 1
      const user = readTelegramUser()

      if (user) {
        setTelegramUser(user)
        clearInterval(interval)
      }

      if (attempts >= 15) {
        clearInterval(interval)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (wallet) checkAccess()
  }, [wallet, lang])

  async function checkAccess() {
    if (!wallet) return
    setLoading(true)
    setStatus(t.checking)

    try {
      const holderRes = await fetch(`/api/check-plankton?wallet=${wallet}`)
      const holderData = await holderRes.json()

      const subRes = await fetch(`/api/subscription/check?wallet=${wallet}`)
      const subData = await subRes.json()

      const holderAccess = Boolean(holderData.hasAccess)
      const subAccess = Boolean(subData.active)

      setBalance(Number(holderData.balance || 0))
      setHasAccess(holderAccess || subAccess)

      if (holderAccess) {
        setStatus(t.active)
      } else if (subAccess) {
        setStatus(t.subActive)
      } else {
        setStatus(t.locked)
      }
    } catch {
      setStatus('Error')
    }

    setLoading(false)
  }

  async function generateConfig() {
    if (!wallet) return
    setLoading(true)
  
    try {
      const res = await fetch('/api/vpn/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          protocol,
        }),
      })
  
      const data = await res.json()
  
      if (!data.ok || !data.device?.name) {
        console.error('VPN create error:', data)
        alert(data.error || 'VPN config creation failed')
        setLoading(false)
        return
      }
  
      const deviceName = encodeURIComponent(data.device.name)
  
      setConfigUrl(`/api/vpn/download?name=${deviceName}`)
      setStatus('Config ready')
    } catch (e) {
      console.error(e)
      setStatus('Error')
      alert('VPN config creation failed')
    }
  
    setLoading(false)
  }

  async function createPlan(plan: string, currency: string) {
    if (!wallet || currency !== 'PLANKTON') return

    try {
      setLoading(true)

      // Get the user's PLANKTON jetton wallet address from the server
      const jwRes = await fetch(`/api/payment/plankton-wallet?wallet=${encodeURIComponent(wallet)}`)
      const jwData = await jwRes.json()

      if (!jwData.ok || !jwData.jettonWallet) {
        alert('Could not find your PLANKTON wallet. Make sure you hold some $PLANKTON.')
        setLoading(false)
        return
      }

      const createRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, plan, currency: 'PLANKTON' }),
      })
      const created = await createRes.json()

      if (!created.payment?.id) {
        alert('Payment creation failed')
        setLoading(false)
        return
      }

      const receiver = process.env.NEXT_PUBLIC_PAYMENT_WALLET!

      // TEP-74 jetton transfer body — amount locked by server in payment.amountToken
      const transferBody = beginCell()
        .storeUint(0x0f8a7ea5, 32)                             // transfer op
        .storeUint(0, 64)                                      // query_id
        .storeCoins(BigInt(created.payment.amountToken))       // amount of jettons
        .storeAddress(Address.parse(receiver))        // destination (receives jettons)
        .storeAddress(Address.parse(wallet))          // response_destination (excess TON back)
        .storeBit(false)                              // no custom payload
        .storeCoins(toNano('0.01'))                   // forward_ton_amount
        .storeBit(false)                              // forward payload inline
        .endCell()

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: jwData.jettonWallet,
            amount: toNano('0.07').toString(), // gas for jetton transfer
            payload: Buffer.from(transferBody.toBoc()).toString('base64'),
          },
        ],
      })

      setStatus(t.checking)
      const verified = await pollVerify('/api/payment/verify-plankton', {
        paymentId: created.payment.id,
      })

      if (verified) {
        alert('$PLANKTON payment confirmed. VPN subscription activated.')
        await checkAccess()
      } else {
        alert('Payment sent but not confirmed yet. Wait a moment and check your access again.')
      }
    } catch (e) {
      console.error(e)
      alert('Payment cancelled or failed')
    }

    setLoading(false)
  }

  async function payWithTon(plan: string) {
    if (!wallet) return

    const receiver = process.env.NEXT_PUBLIC_PAYMENT_WALLET
    if (!receiver) {
      alert('Payment wallet missing')
      return
    }

    try {
      setLoading(true)

      const createRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, plan, currency: 'TON' }),
      })
      const created = await createRes.json()

      if (!created.payment?.id) {
        alert('Payment creation failed')
        setLoading(false)
        return
      }

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: receiver,
            amount: created.payment.amountToken,  // locked by server at create time
            payload: beginCell()
  .storeUint(0, 32)
  .storeStringTail(created.payment.id)
  .endCell()
  .toBoc()
  .toString('base64'),
          },
        ],
      })

      // Poll tonapi until the transaction is confirmed on-chain
      setStatus(t.checking)
      const verified = await pollVerify('/api/payment/verify-ton', {
        paymentId: created.payment.id,
        boc: result.boc,
      })

      if (verified) {
        alert('TON payment confirmed. VPN subscription activated.')
        await checkAccess()
      } else {
        alert('Payment sent but not confirmed yet. Wait a moment and check your access again.')
      }
    } catch (e) {
      console.error(e)
      alert('Payment cancelled or failed')
    }

    setLoading(false)
  }

  return (
    <div style={shell}>
      {showSplash && <Splash />}

      <div style={frame}>
        <div style={wrap}>
          <div style={card}>
            <Header lang={lang} setLang={setLang} />

            {tab === 'home' && (
              <>
                <Hero t={t} />
                <HomeLinks t={t} />
              </>
            )}

            {tab === 'vpn' && (
              <>
                <Hero t={t} />

                <div style={walletCard}>
                  <TonConnectButton />
                  {wallet && <div style={walletText}>{wallet}</div>}
                </div>

                {wallet && (
                  <>
                    <button onClick={checkAccess} disabled={loading} style={blueBtn}>
                      {loading ? t.checking : t.check}
                    </button>

                    <div style={stats}>
                      <InfoCard label="$PLANKTON" value={balance.toLocaleString()} />
                      <InfoCard
                        label="STATUS"
                        value={status}
                        color={hasAccess ? '#39f58f' : '#ff6b6b'}
                      />
                    </div>

                    {(!hasAccess || forcePlans) && (
                      <>
                        <a href={BUY_URL} target="_blank" style={buyBtn}>
                          {t.buy}
                        </a>

                        <PlansBlock
                          t={t}
                          loading={loading}
                          createPlan={createPlan}
                          payWithTon={payWithTon}
                          pricingData={pricingData}
                        />
                      </>
                    )}

                    {hasAccess && (
                      <div style={setupCard}>
                        <ProtocolSelector
                          t={t}
                          protocol={protocol}
                          setProtocol={setProtocol}
                        />

                        {protocol === 'wireguard' && (
                          <>
                            <div style={wgHead}>
                              <div style={wgLogoBox}>
                                <img src="/assets/wireguard-logo.png" alt="WireGuard" style={wgLogo} />
                              </div>

                              <div>
                                <div style={wgTitle}>WireGuard</div>
                                <div style={muted}>Official VPN protocol</div>
                              </div>
                            </div>

                            <a href={WIREGUARD_URL} target="_blank" style={outlineBtn}>
                              ⬇ {t.install}
                            </a>

                            <button onClick={generateConfig} disabled={loading} style={greenBtn}>
                              ⚙ {loading ? t.checking : t.generate}
                            </button>

                            {configUrl && (
                              <a href={configUrl} target="_blank" style={downloadBtn}>
                                📄 {t.download}
                              </a>
                            )}
                          </>
                        )}

                        {protocol === 'amnezia' && (
                          <>
                            <div style={amneziaBox}>
                              <div style={amneziaLogoBox}>
                                <img
                                  src="/amnezia-logo.png"
                                  alt="Amnezia VPN"
                                  style={amneziaLogo}
                                />
                              </div>

                              <div>
                                <div style={wgTitle}>Amnezia VPN</div>
                                <div style={muted}>{t.amneziaDesc}</div>
                                <div style={comingSoon}>AWG profile</div>
                              </div>
                            </div>

                            <a
                              href="https://amnezia.org/"
                              target="_blank"
                              rel="noopener"
                              style={outlineBtn}
                            >
                              ⬇ Install Amnezia VPN
                            </a>

                            <button onClick={generateConfig} disabled={loading} style={greenBtn}>
                              ⚙ {loading ? t.checking : t.generate}
                            </button>

                            {configUrl && (
                              <a href={configUrl} target="_blank" style={downloadBtn}>
                                📄 {t.download}
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {tab === 'guide' && <Guide t={t} />}

            {tab === 'profile' && (
              <Profile
                t={t}
                wallet={wallet}
                telegramUser={telegramUser}
                balance={balance}
                status={status}
                hasAccess={hasAccess}
              />
            )}
          </div>
        </div>
      </div>

      <div style={nav}>
        <NavBtn active={tab === 'home'} label={t.home} icon="⌂" onClick={() => setTab('home')} />
        <NavBtn active={tab === 'vpn'} label={t.vpn} icon="◆" onClick={() => setTab('vpn')} />
        <NavBtn active={tab === 'guide'} label={t.guide} icon="?" onClick={() => setTab('guide')} />
        <NavBtn active={tab === 'profile'} label={t.profile} icon="●" onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}


function ProtocolSelector({ t, protocol, setProtocol }: any) {
  return (
    <div style={protocolWrap}>
      <div style={sectionTitle}>{t.protocol}</div>

      <button
        type="button"
        onClick={() => setProtocol('wireguard')}
        style={{ ...protocolCard, ...(protocol === 'wireguard' ? protocolCardActive : {}) }}
      >
        <div style={protocolName}>WireGuard</div>
        <div style={muted}>{t.wireguardDesc}</div>
      </button>

      <button
        type="button"
        onClick={() => setProtocol('amnezia')}
        style={{ ...protocolCard, ...(protocol === 'amnezia' ? protocolCardActive : {}) }}
      >
        <div style={protocolName}>Amnezia VPN</div>
        <div style={muted}>{t.amneziaDesc}</div>
      </button>
    </div>
  )
}

function PlansBlock({ t, loading, createPlan, payWithTon, pricingData }: any) {
  const plans = [
    { key: 'ONE_MONTH',     label: '1 Month',   tonUsd: 3,  planktonUsd: 2  },
    { key: 'THREE_MONTHS',  label: '3 Months',  tonUsd: 7,  planktonUsd: 5  },
    { key: 'TWELVE_MONTHS', label: '12 Months', tonUsd: 20, planktonUsd: 14 },
  ]

  return (
    <div style={setupCard}>
      <div style={sectionTitle}>{t.plans}</div>

      {plans.map(({ key, label, tonUsd, planktonUsd }) => {
        const api = pricingData?.plans?.find((p: any) => p.plan === key)
        const tonLine      = api ? `${api.tonDisplay} TON ≈ $${tonUsd}`           : `TON: $${tonUsd}`
        const planktonLine = api ? `${api.planktonDisplay} $PLANKTON ≈ $${planktonUsd}` : `$PLANKTON: $${planktonUsd}`

        return (
          <div key={key} style={planCard}>
            <div>
              <div style={planTitle}>{label}</div>
              <div style={muted}>{tonLine}</div>
              <div style={muted}>{planktonLine}</div>
            </div>

            <div style={planButtons}>
              <button disabled={loading} onClick={() => payWithTon(key)} style={smallGreenBtn}>
                TON
              </button>
              <button disabled={loading} onClick={() => createPlan(key, 'PLANKTON')} style={smallBlueBtn}>
                $PLANKTON
              </button>
            </div>
          </div>
        )
      })}

      <div style={poweredBy}>
        Prices powered by{' '}
        <a href="https://www.coingecko.com" target="_blank" rel="noopener" style={cgLink}>
          CoinGecko
        </a>
      </div>
    </div>
  )
}

function Splash() {
  return (
    <div style={splash}>
      <img src="/assets/plankton-splash.png" alt="Plankton" style={splashImg} />
      <div style={splashTitle}>PLANKTON VPN</div>
    </div>
  )
}

function Header({ lang, setLang }: any) {
  return (
    <div style={topRow}>
      <div style={badge}>CEO PLANKTON</div>

      <select value={lang} onChange={(e) => setLang(e.target.value)} style={select}>
        <option value="en">🇺🇸 EN</option>
        <option value="ru">🇷🇺 RU</option>
        <option value="ua">🇺🇦 UA</option>
        <option value="zh">🇨🇳 中文</option>
      </select>
    </div>
  )
}

function Hero({ t }: any) {
  return (
    <>
      <div style={logoWrap}>
        <img src="/assets/logo.png" alt="Plankton" style={logo} />
      </div>

      <h1 style={title}>{t.title}</h1>
      <p style={subtitle}>{t.subtitle}</p>
      <p style={hold}>{t.hold}</p>
    </>
  )
}

function HomeLinks({ t }: any) {
  return (
    <div style={setupCard}>
      <div style={sectionTitle}>{t.links}</div>

      <a href={TG_CHANNEL} target="_blank" style={linkBtn}>
        📢 {t.channel}
      </a>

      <a href={TG_CHAT} target="_blank" style={linkBtn}>
        💬 {t.chat}
      </a>

      <a href={X_URL} target="_blank" style={linkBtn}>
        𝕏 {t.twitter}
      </a>

      <a href={BUY_URL} target="_blank" style={buyBtn}>
        {t.buy}
      </a>
    </div>
  )
}

function Guide({ t }: any) {
  return (
    <div style={setupCard}>
      <div style={sectionTitle}>{t.guideTitle}</div>

      <GuideStep n="1" text={t.step1} />
      <GuideStep n="2" text={t.step2} />
      <GuideStep n="3" text={t.step3} />
      <GuideStep n="4" text={t.step4} />

      <a href={WIREGUARD_URL} target="_blank" style={downloadBtn}>
        ⬇ {t.wgOfficial}
      </a>
    </div>
  )
}

function GuideStep({ n, text }: any) {
  return (
    <div style={step}>
      <div style={stepNum}>{n}</div>
      <div>{text}</div>
    </div>
  )
}

function Profile({ t, telegramUser, wallet, balance, status, hasAccess }: any) {
  const name =
    telegramUser?.username
      ? `@${telegramUser.username}`
      : [telegramUser?.first_name, telegramUser?.last_name].filter(Boolean).join(' ') ||
        'Telegram User'

  return (
    <div style={setupCard}>
      <div style={sectionTitle}>{t.dashboard}</div>

      <div style={profileHead}>
        <div style={avatar}>
          {telegramUser?.photo_url ? (
            <img src={telegramUser.photo_url} alt="avatar" style={avatarImg} />
          ) : (
            <div style={tgAvatar}>{name.slice(0, 1).toUpperCase()}</div>
          )}
        </div>

        <div>
          <div style={profileName}>{name}</div>
          <div style={muted}>Telegram profile</div>
        </div>
      </div>

      <div style={stats}>
        <InfoCard label="$PLANKTON" value={balance.toLocaleString()} />
        <InfoCard label="VPN" value={status} color={hasAccess ? '#39f58f' : '#ff6b6b'} />
      </div>

      <div style={profileBlock}>
        <div style={profileLabel}>{t.wallet}</div>
        <div style={profileValue}>{wallet || 'Not connected'}</div>
      </div>
    </div>
  )
}

function InfoCard({ label, value, color = '#fff' }: any) {
  return (
    <div style={infoCard}>
      <div style={infoLabel}>{label}</div>
      <div style={{ ...infoValue, color }}>{value}</div>
    </div>
  )
}

function NavBtn({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} style={navBtn}>
      <div
        style={{
          ...navIcon,
          background: active
            ? 'linear-gradient(135deg,#18f58a,#35c5ff)'
            : 'rgba(255,255,255,.06)',
          color: active ? '#00130b' : '#7f90a3',
        }}
      >
        {icon}
      </div>
      <div style={{ color: active ? '#38f596' : '#78889a', fontWeight: active ? 900 : 700 }}>
        {label}
      </div>
    </button>
  )
}

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at 50% 0%, rgba(0,152,234,.42), transparent 32%), linear-gradient(180deg,#030914,#01030a)',
  color: '#fff',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
  padding: '14px 12px 108px',
  boxSizing: 'border-box',
  overflowX: 'hidden',
}

const frame: React.CSSProperties = {
  maxWidth: 460,
  margin: '0 auto',
  borderRadius: 42,
  padding: 8,
  border: '1px solid rgba(80,212,255,.32)',
  boxShadow: '0 0 34px rgba(0,152,234,.22)',
}

const wrap: React.CSSProperties = { maxWidth: 440, margin: '0 auto' }

const card: React.CSSProperties = {
  borderRadius: 36,
  padding: 18,
  border: '1px solid rgba(255,255,255,.11)',
  background: 'linear-gradient(180deg,rgba(16,26,44,.96),rgba(7,12,24,.96))',
  boxShadow: '0 30px 90px rgba(0,0,0,.55)',
}

const splash: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background:
    'radial-gradient(circle at center, rgba(0,152,234,.28), transparent 42%), #02040a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const splashImg: React.CSSProperties = {
  width: 210,
  maxWidth: '72vw',
  objectFit: 'contain',
}

const splashTitle: React.CSSProperties = {
  marginTop: 22,
  fontSize: 28,
  fontWeight: 1000,
  letterSpacing: -1,
}

const topRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 14,
}

const badge: React.CSSProperties = {
  padding: '8px 13px',
  borderRadius: 999,
  background: 'rgba(0,152,234,.16)',
  color: '#50d4ff',
  fontSize: 12,
  fontWeight: 1000,
  letterSpacing: 1,
}

const select: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,.12)',
  background: '#111827',
  color: '#fff',
  borderRadius: 14,
  padding: '8px 10px',
  fontWeight: 800,
}

const logoWrap: React.CSSProperties = {
  width: 108,
  height: 108,
  margin: '8px auto 14px',
  borderRadius: 34,
  background: 'linear-gradient(135deg,#0098ea,#19f58a)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const logo: React.CSSProperties = {
  width: 86,
  height: 86,
  objectFit: 'contain',
  borderRadius: 26,
}

const title: React.CSSProperties = {
  margin: 0,
  textAlign: 'center',
  fontSize: 42,
  lineHeight: 0.92,
  fontWeight: 1000,
  letterSpacing: -2,
  background: 'linear-gradient(90deg,#fff,#99e8ff,#18f58a)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}

const subtitle: React.CSSProperties = {
  textAlign: 'center',
  color: '#b7c8dc',
  fontSize: 15,
  lineHeight: 1.45,
  margin: '14px 0 6px',
}

const hold: React.CSSProperties = {
  textAlign: 'center',
  color: '#6fdfaa',
  fontSize: 13,
  fontWeight: 800,
  margin: '0 0 18px',
}

const walletCard: React.CSSProperties = {
  borderRadius: 24,
  padding: 14,
  background: 'rgba(255,255,255,.045)',
  border: '1px solid rgba(255,255,255,.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  marginBottom: 14,
}

const walletText: React.CSSProperties = {
  fontSize: 12,
  color: '#8fa3b8',
  wordBreak: 'break-all',
  textAlign: 'center',
}

const blueBtn: React.CSSProperties = {
  width: '100%',
  height: 58,
  border: 0,
  borderRadius: 20,
  background: 'linear-gradient(90deg,#0098ea,#54d8ff)',
  color: '#00111d',
  fontSize: 17,
  fontWeight: 1000,
  marginBottom: 14,
}

const stats: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
  marginBottom: 14,
}

const infoCard: React.CSSProperties = {
  minHeight: 88,
  borderRadius: 22,
  padding: 14,
  background: 'rgba(255,255,255,.055)',
  border: '1px solid rgba(255,255,255,.075)',
}

const infoLabel: React.CSSProperties = { color: '#77889a', fontSize: 12, fontWeight: 900 }

const infoValue: React.CSSProperties = {
  marginTop: 9,
  fontSize: 20,
  fontWeight: 1000,
  lineHeight: 1.1,
  wordBreak: 'break-word',
}

const buyBtn: React.CSSProperties = {
  display: 'flex',
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  background: 'linear-gradient(90deg,#22c55e,#7cff9e)',
  color: '#03120a',
  fontSize: 18,
  fontWeight: 1000,
  textDecoration: 'none',
  marginTop: 10,
}

const setupCard: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 28,
  padding: 16,
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.08)',
}

const wgHead: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 16,
}

const wgLogoBox: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 20,
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const wgLogo: React.CSSProperties = {
  width: 48,
  height: 48,
  objectFit: 'contain',
}

const wgTitle: React.CSSProperties = { fontSize: 22, fontWeight: 1000 }
const muted: React.CSSProperties = { color: '#8fa3b8', fontSize: 13 }

const outlineBtn: React.CSSProperties = {
  display: 'flex',
  height: 54,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,.14)',
  color: '#fff',
  background: 'rgba(255,255,255,.06)',
  textDecoration: 'none',
  fontWeight: 1000,
  marginBottom: 10,
}

const greenBtn: React.CSSProperties = {
  width: '100%',
  height: 54,
  border: 0,
  borderRadius: 18,
  background: 'linear-gradient(90deg,#19d47b,#67ffae)',
  color: '#00120a',
  fontWeight: 1000,
  fontSize: 16,
  marginBottom: 10,
}

const downloadBtn: React.CSSProperties = {
  display: 'flex',
  height: 54,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 18,
  background: 'linear-gradient(90deg,#0098ea,#54d8ff)',
  color: '#00111d',
  textDecoration: 'none',
  fontWeight: 1000,
  marginBottom: 10,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 1000,
  marginBottom: 12,
}

const linkBtn: React.CSSProperties = {
  width: '100%',
  minHeight: 52,
  border: 0,
  borderRadius: 18,
  background: 'rgba(255,255,255,.07)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  fontWeight: 900,
  marginBottom: 10,
}

const planCard: React.CSSProperties = {
  borderRadius: 20,
  padding: 14,
  background: 'rgba(255,255,255,.055)',
  border: '1px solid rgba(255,255,255,.075)',
  marginBottom: 10,
}

const planTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 1000,
  marginBottom: 4,
}

const planButtons: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginTop: 12,
}

const poweredBy: React.CSSProperties = {
  marginTop: 10,
  textAlign: 'center',
  fontSize: 11,
  color: '#4a6070',
}

const cgLink: React.CSSProperties = {
  color: '#6a90a8',
  textDecoration: 'none',
}

const protocolWrap: React.CSSProperties = {
  display: 'grid',
  gap: 10,
  marginBottom: 16,
}

const protocolCard: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  borderRadius: 20,
  padding: 14,
  background: 'rgba(255,255,255,.045)',
  border: '1px solid rgba(255,255,255,.08)',
  color: '#fff',
}

const protocolCardActive: React.CSSProperties = {
  border: '1px solid rgba(80,212,255,.65)',
  boxShadow: '0 0 24px rgba(0,152,234,.16)',
  background: 'linear-gradient(180deg,rgba(0,152,234,.18),rgba(255,255,255,.045))',
}

const protocolName: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 1000,
  marginBottom: 5,
}

const amneziaBox: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  borderRadius: 22,
  padding: 14,
  background: 'rgba(0,152,234,.10)',
  border: '1px solid rgba(80,212,255,.18)',
}

const amneziaLogoBox: React.CSSProperties = {
  width: 86,
  height: 86,
  minWidth: 86,
  borderRadius: 24,
  overflow: 'hidden',
  background: 'rgba(255,255,255,0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const amneziaLogo: React.CSSProperties = {
  width: 86,
  height: 86,
  objectFit: 'contain',
  display: 'block',
}

const comingSoon: React.CSSProperties = {
  display: 'inline-flex',
  marginTop: 10,
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(255,255,255,.08)',
  color: '#50d4ff',
  fontSize: 11,
  fontWeight: 1000,
}

const smallGreenBtn: React.CSSProperties = {
  height: 42,
  border: 0,
  borderRadius: 14,
  background: 'linear-gradient(90deg,#19d47b,#67ffae)',
  color: '#00120a',
  fontWeight: 1000,
}

const smallBlueBtn: React.CSSProperties = {
  height: 42,
  border: 0,
  borderRadius: 14,
  background: 'linear-gradient(90deg,#0098ea,#54d8ff)',
  color: '#00111d',
  fontWeight: 1000,
}

const step: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderRadius: 18,
  padding: 14,
  background: 'rgba(255,255,255,.055)',
  marginBottom: 10,
  color: '#c8d6e6',
  fontWeight: 800,
  lineHeight: 1.35,
}

const stepNum: React.CSSProperties = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: 12,
  background: 'linear-gradient(135deg,#0098ea,#18f58a)',
  color: '#00111d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 1000,
}

const profileHead: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 16,
}

const avatar: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 24,
  overflow: 'hidden',
}

const avatarImg: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const tgAvatar: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg,#2aabee,#19f58a)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#00111d',
  fontWeight: 1000,
  fontSize: 28,
}

const profileName: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 1000,
}

const profileBlock: React.CSSProperties = {
  borderRadius: 18,
  padding: 14,
  background: 'rgba(0,0,0,.18)',
  border: '1px solid rgba(255,255,255,.07)',
}

const profileLabel: React.CSSProperties = {
  color: '#77889a',
  fontSize: 12,
  fontWeight: 900,
  marginBottom: 8,
}

const profileValue: React.CSSProperties = {
  color: '#aebed0',
  fontSize: 12,
  lineHeight: 1.4,
  wordBreak: 'break-all',
}

const nav: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  bottom: 14,
  transform: 'translateX(-50%)',
  width: 'calc(100% - 28px)',
  maxWidth: 440,
  height: 76,
  borderRadius: 30,
  background: 'rgba(9,16,31,.94)',
  border: '1px solid rgba(255,255,255,.1)',
  backdropFilter: 'blur(20px)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  alignItems: 'center',
}

const navBtn: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  textAlign: 'center',
  fontSize: 11,
}

const navIcon: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 12,
  margin: '0 auto 5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 1000,
}
