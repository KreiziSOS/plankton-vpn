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
const TG_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, '') ||
  'PlanktonVPNBot'
const TG_BOT_URL =
  (process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || `https://t.me/${TG_BOT_USERNAME}`).replace(/\/$/, '')
const X_URL = 'https://x.com/CEO_Plankton'

type Tab = 'home' | 'vpn' | 'market' | 'guide' | 'profile'
type Lang = 'en' | 'ru' | 'ua' | 'zh'
type Protocol = 'wireguard' | 'amnezia'

type VpnDevice = {
  id: string
  wallet: string
  name: string
  clientId?: string | null
  address?: string | null
  protocol?: Protocol | string
  enabled: boolean
  expiresAt?: string | null
  createdAt?: string | null
}

declare global {
  interface Window {
    Telegram?: any
  }
}

const TEXT = {
  en: {
    title: 'PLANKTON VPN',
    subtitle: 'Private VPN access for the $PLANKTON community.',
    hold: 'Hold 1,000,000 $PLANKTON to unlock free VPN access.',
    check: 'Check Access',
    checking: 'Checking...',
    active: 'VPN Access Active',
    locked: 'Access Locked',
    buy: 'BUY $PLANKTON',
    install: 'Install',
    generate: 'Generate Config',
    download: 'Download Config',
    downloadWireguard: 'Download WireGuard .conf',
    downloadAmnezia: 'Download Amnezia .awg',
    openConfigBrowser: 'Open Config in Browser',
    configOpenNote: 'iPhone: if the file opens in Amnezia by mistake, open the WireGuard app → tap ➕ → "Create from file or archive" → pick the .conf from Downloads.',
    home: 'Home',
    vpn: 'VPN',
    guide: 'Guide',
    profile: 'Profile',
    market: 'Market',
    devices: 'My VPN Devices',
    noDevices: 'No VPN devices yet',
    refresh: 'Refresh',
    deleteDevice: 'Delete',
    activeDevice: 'Active',
    disabledDevice: 'Disabled',
    expires: 'Expires',
    openMarket: 'Open Market',
    links: 'Community',
    channel: 'Telegram Channel',
    chat: 'Telegram Chat',
    bot: 'Telegram Bot',
    twitter: 'X / Twitter',
    dashboard: 'Profile Dashboard',
    wallet: 'Wallet',
    notConnected: 'Not connected',
    statusLabel: 'STATUS',
    telegramProfile: 'Telegram profile',
    guideTitle: 'How to activate VPN',
    wgOfficial: 'Open WireGuard Official',
    plans: 'VPN Plans',
    subActive: 'Subscription Active',
    protocol: 'VPN Protocol',
    wireguardDesc: 'Fast • Lightweight • Default',
    amneziaDesc: 'Better bypass • Anti-blocking • Smart routing',
    recommendedUse: 'Recommended use',
    generatedFile: 'Generated file',
    wgRecommended: 'Everyday VPN access with the official WireGuard app.',
    amRecommended: 'Networks with blocking or DPI where AWG helps bypass filters.',
    holderFree: 'Holder / Free',
    holderDuration: 'Free holder VPN access',
    comingSoon: 'Coming soon',
    marketIntro: 'Buy extra VPN access even if you are already a holder. Paid plans unlock more devices and longer access.',
    month1: '1 Month',
    month3: '3 Months',
    month12: '12 Months',
    days30: '30 days VPN access',
    days90: '90 days VPN access',
    days365: '365 days VPN access',
    devicesCount: 'devices',
    bestOne: 'Best for testing PLANKTON VPN on phone and laptop.',
    bestThree: 'Best balance for everyday use and several devices.',
    bestYear: 'Best value. Perfect for power users and long-term access.',
    featureProtocols: 'WireGuard + Amnezia',
    featureDevices: 'Mobile + Desktop',
    featureExpiry: 'Auto disable on expiry',
    featureTelegram: 'Telegram-native access',
    deviceLimitLine: 'Device limit',
    activeVpnDevices: 'active VPN device(s)',
    protocolsIncluded: 'WireGuard and Amnezia VPN included.',
    holderDeviceBadge: '1 WireGuard + 1 Amnezia',
    payTon: 'Pay TON',
    payPlankton: 'Pay $PLANKTON',
    pricesPoweredBy: 'Prices powered by',
    priceTonLabel: 'TON',
    pricePlanktonLabel: '$PLANKTON',
    guideWireguardDesc: 'Fast, lightweight and default VPN protocol.',
    guideAmneziaDesc: 'Better bypass, anti-blocking and AWG profile support.',
    guideLimitsTitle: 'Device limits',
    wgStep1: 'Install the official WireGuard app.',
    wgStep2: 'Open VPN tab and select WireGuard.',
    wgStep3: 'Generate and download your .conf file.',
    wgStep4: 'Import the file into WireGuard and turn tunnel ON.',
    amStep1: 'Install Amnezia VPN from the official website or app store.',
    amStep2: 'Open VPN tab and select Amnezia VPN.',
    amStep3: 'Generate and download your .awg profile.',
    amStep4: 'Import the .awg profile into Amnezia and enable VPN.',
    openAmnezia: 'Open Amnezia Official',
    limitHolder: 'Holder access gives 1 WireGuard device and 1 Amnezia device.',
    limitOne: '1 Month plan gives 2 VPN devices.',
    limitThree: '3 Months plan gives 3 VPN devices.',
    limitYear: '12 Months plan gives 5 VPN devices.',
    connectWalletDevices: 'Connect wallet to see your devices.',
    loadingDevices: 'Loading devices...',
    noIp: 'No IP',
    privateVpnAccess: 'Private VPN access',
    stableMobileConfig: 'Stable mobile config',
    autoDisabledExpires: 'Auto disabled if access expires',
    installProtocol: 'Install',
    confConfig: '.conf config',
    awgProfile: '.awg profile',
    referralTitle: 'Referral Program',
    referralSubtitle: 'Invite friends and earn from paid VPN subscriptions.',
    referralReward: '5 active paid referrals → 1 year VPN free',
    totalReferrals: 'Total referrals',
    activePaid: 'Active paid',
    earnedTon: 'Earned TON',
    freeYearProgress: 'Free year progress',
    inviteFriend: 'Invite Friend',
    copy: 'Copy',
    withdrawals: 'Withdrawals from 1 TON by manual admin approval.',
    referralShareText: 'Join PLANKTON VPN and unlock private VPN access with TON / $PLANKTON.',
    referralLoading: 'Preparing referral code...',
    copied: 'Referral link copied',
    copyFailed: 'Could not copy link',
    connectWalletFirst: 'Connect wallet first',
    telegramUserFallback: 'Telegram User',
    deleteConfirm: 'Delete this VPN device?',
    deleteFailed: 'Failed to delete device',
    paymentWalletMissing: 'Payment wallet missing',
    paymentCreationFailed: 'Payment creation failed',
    planktonWalletMissing: 'Could not find your PLANKTON wallet. Make sure you hold some $PLANKTON.',
    planktonPaymentConfirmed: '$PLANKTON payment confirmed. VPN subscription activated.',
    tonPaymentConfirmed: 'TON payment confirmed. VPN subscription activated.',
    paymentPending: 'Payment sent but not confirmed yet. Wait a moment and check your access again.',
    paymentFailed: 'Payment cancelled or failed',
    vpnCreateFailed: 'VPN config creation failed',
    deviceLimitTitle: 'Device limit reached.',
    currentLimit: 'Current limit',
    usedDevices: 'Used',
    upgradeMarket: 'Open Market to upgrade your plan and add more devices.',
    configReady: 'Config ready',
    error: 'Error',
    guideFaqTitle: 'Troubleshooting',
    faqAmneziaConflictTitle: 'WG config opens in Amnezia instead of WireGuard',
    faqStep1: 'Open the WireGuard app on iPhone',
    faqStep2: 'Tap ➕ in the top right corner',
    faqStep3: 'Select "Create from file or archive"',
    faqStep4: 'Find the .conf file in Downloads and confirm import',
  },
  ru: {
    title: 'PLANKTON VPN',
    subtitle: 'Приватный VPN-доступ для сообщества $PLANKTON.',
    hold: 'Холди 1,000,000 $PLANKTON, чтобы получить бесплатный VPN.',
    check: 'Проверить доступ',
    checking: 'Проверка...',
    active: 'VPN доступ активен',
    locked: 'Доступ закрыт',
    buy: 'КУПИТЬ $PLANKTON',
    install: 'Установить',
    generate: 'Создать конфиг',
    download: 'Скачать конфиг',
    downloadWireguard: 'Скачать WireGuard .conf',
    downloadAmnezia: 'Скачать Amnezia .awg',
    openConfigBrowser: 'Открыть конфиг в браузере',
    configOpenNote: 'iPhone: если файл по ошибке открылся в Amnezia, откройте приложение WireGuard → нажмите ➕ → «Создать из файла или архива» → выберите .conf из Загрузок.',
    home: 'Главная',
    vpn: 'VPN',
    guide: 'Гайд',
    profile: 'Профиль',
    market: 'Маркет',
    devices: 'Мои VPN устройства',
    noDevices: 'VPN устройств пока нет',
    refresh: 'Обновить',
    deleteDevice: 'Удалить',
    activeDevice: 'Активно',
    disabledDevice: 'Отключено',
    expires: 'Истекает',
    openMarket: 'Открыть маркет',
    links: 'Комьюнити',
    channel: 'Telegram канал',
    chat: 'Telegram чат',
    bot: 'Telegram бот',
    twitter: 'X / Twitter',
    dashboard: 'Панель профиля',
    wallet: 'Кошелёк',
    notConnected: 'Не подключён',
    statusLabel: 'СТАТУС',
    telegramProfile: 'Telegram профиль',
    guideTitle: 'Как активировать VPN',
    wgOfficial: 'Открыть WireGuard Official',
    plans: 'VPN тарифы',
    subActive: 'Подписка активна',
    protocol: 'VPN протокол',
    wireguardDesc: 'Быстрый • Лёгкий • По умолчанию',
    amneziaDesc: 'Лучше обход • Антиблокировка • Smart routing',
    recommendedUse: 'Рекомендуемое использование',
    generatedFile: 'Формат файла',
    wgRecommended: 'Ежедневный VPN-доступ через официальное приложение WireGuard.',
    amRecommended: 'Сети с блокировками или DPI, где AWG помогает обходить фильтры.',
    holderFree: 'Холдер / бесплатно',
    holderDuration: 'Бесплатный VPN-доступ для холдеров',
    comingSoon: 'Скоро',
    marketIntro: 'Покупай дополнительный VPN-доступ даже если ты уже холдер. Платные тарифы дают больше устройств и более долгий доступ.',
    month1: '1 месяц',
    month3: '3 месяца',
    month12: '12 месяцев',
    days30: '30 дней VPN-доступа',
    days90: '90 дней VPN-доступа',
    days365: '365 дней VPN-доступа',
    devicesCount: 'устройства',
    bestOne: 'Лучше всего для теста PLANKTON VPN на телефоне и ноутбуке.',
    bestThree: 'Оптимальный баланс для ежедневного использования и нескольких устройств.',
    bestYear: 'Лучшее предложение для активных пользователей и долгого доступа.',
    featureProtocols: 'WireGuard + Amnezia',
    featureDevices: 'Мобильный + ПК',
    featureExpiry: 'Автоотключение после окончания доступа',
    featureTelegram: 'Доступ прямо через Telegram',
    deviceLimitLine: 'Лимит устройств',
    activeVpnDevices: 'активных VPN устройств(а)',
    protocolsIncluded: 'WireGuard и Amnezia VPN включены.',
    holderDeviceBadge: '1 WireGuard + 1 Amnezia',
    payTon: 'Оплатить TON',
    payPlankton: 'Оплатить $PLANKTON',
    pricesPoweredBy: 'Цены обновляются через',
    priceTonLabel: 'TON',
    pricePlanktonLabel: '$PLANKTON',
    guideWireguardDesc: 'Быстрый, лёгкий и основной VPN-протокол.',
    guideAmneziaDesc: 'Лучше для обхода блокировок, антиблокинга и AWG профиля.',
    guideLimitsTitle: 'Лимиты устройств',
    wgStep1: 'Установи официальное приложение WireGuard.',
    wgStep2: 'Открой вкладку VPN и выбери WireGuard.',
    wgStep3: 'Создай и скачай .conf файл.',
    wgStep4: 'Импортируй файл в WireGuard и включи туннель.',
    amStep1: 'Установи Amnezia VPN с официального сайта или из app store.',
    amStep2: 'Открой вкладку VPN и выбери Amnezia VPN.',
    amStep3: 'Создай и скачай .awg профиль.',
    amStep4: 'Импортируй .awg профиль в Amnezia и включи VPN.',
    openAmnezia: 'Открыть Amnezia Official',
    limitHolder: 'Холдерский доступ даёт 1 устройство WireGuard и 1 устройство Amnezia.',
    limitOne: 'Тариф 1 месяц даёт 2 VPN устройства.',
    limitThree: 'Тариф 3 месяца даёт 3 VPN устройства.',
    limitYear: 'Тариф 12 месяцев даёт 5 VPN устройств.',
    connectWalletDevices: 'Подключи кошелёк, чтобы увидеть устройства.',
    loadingDevices: 'Загрузка устройств...',
    noIp: 'Нет IP',
    privateVpnAccess: 'Приватный VPN-доступ',
    stableMobileConfig: 'Стабильный мобильный конфиг',
    autoDisabledExpires: 'Автоотключение при окончании доступа',
    installProtocol: 'Установить',
    confConfig: '.conf конфиг',
    awgProfile: '.awg профиль',
    referralTitle: 'Реферальная программа',
    referralSubtitle: 'Приглашай друзей и зарабатывай с платных VPN-подписок.',
    referralReward: '5 активных платных рефералов → 1 год VPN бесплатно',
    totalReferrals: 'Всего рефералов',
    activePaid: 'Активных платных',
    earnedTon: 'Заработано TON',
    freeYearProgress: 'Прогресс к бесплатному году',
    inviteFriend: 'Пригласить друга',
    copy: 'Копировать',
    withdrawals: 'Вывод от 1 TON по заявке и ручному одобрению админом.',
    referralShareText: 'Подключайся к PLANKTON VPN и получай приватный VPN-доступ через TON / $PLANKTON.',
    referralLoading: 'Готовим реферальный код...',
    copied: 'Реферальная ссылка скопирована',
    copyFailed: 'Не удалось скопировать ссылку',
    connectWalletFirst: 'Сначала подключи кошелёк',
    telegramUserFallback: 'Telegram пользователь',
    deleteConfirm: 'Удалить это VPN устройство?',
    deleteFailed: 'Не удалось удалить устройство',
    paymentWalletMissing: 'Кошелёк для оплаты не указан',
    paymentCreationFailed: 'Не удалось создать платеж',
    planktonWalletMissing: 'Не удалось найти твой PLANKTON wallet. Убедись, что у тебя есть $PLANKTON.',
    planktonPaymentConfirmed: '$PLANKTON платеж подтверждён. VPN подписка активирована.',
    tonPaymentConfirmed: 'TON платеж подтверждён. VPN подписка активирована.',
    paymentPending: 'Платёж отправлен, но ещё не подтверждён. Подожди немного и проверь доступ снова.',
    paymentFailed: 'Платёж отменён или не прошёл',
    vpnCreateFailed: 'Не удалось создать VPN конфиг',
    deviceLimitTitle: 'Достигнут лимит устройств.',
    currentLimit: 'Текущий лимит',
    usedDevices: 'Использовано',
    upgradeMarket: 'Открой маркет, чтобы улучшить тариф и добавить устройства.',
    configReady: 'Конфиг готов',
    error: 'Ошибка',
    guideFaqTitle: 'Решение проблем',
    faqAmneziaConflictTitle: 'WG-конфиг открывается в Amnezia вместо WireGuard',
    faqStep1: 'Откройте приложение WireGuard на iPhone',
    faqStep2: 'Нажмите ➕ в правом верхнем углу',
    faqStep3: 'Выберите «Создать из файла или архива»',
    faqStep4: 'Найдите .conf файл в Загрузках и подтвердите импорт',
  },
  ua: {
    title: 'PLANKTON VPN',
    subtitle: 'Приватний VPN-доступ для спільноти $PLANKTON.',
    hold: 'Тримай 1,000,000 $PLANKTON, щоб отримати безкоштовний VPN.',
    check: 'Перевірити доступ',
    checking: 'Перевірка...',
    active: 'VPN доступ активний',
    locked: 'Доступ закрито',
    buy: 'КУПИТИ $PLANKTON',
    install: 'Встановити',
    generate: 'Створити конфіг',
    download: 'Завантажити конфіг',
    downloadWireguard: 'Завантажити WireGuard .conf',
    downloadAmnezia: 'Завантажити Amnezia .awg',
    openConfigBrowser: 'Відкрити конфіг у браузері',
    configOpenNote: 'iPhone: якщо файл помилково відкрився в Amnezia, відкрийте застосунок WireGuard → натисніть ➕ → «Створити з файлу або архіву» → виберіть .conf із Завантажень.',
    home: 'Головна',
    vpn: 'VPN',
    guide: 'Гайд',
    profile: 'Профіль',
    market: 'Маркет',
    devices: 'Мої VPN пристрої',
    noDevices: 'VPN пристроїв поки немає',
    refresh: 'Оновити',
    deleteDevice: 'Видалити',
    activeDevice: 'Активно',
    disabledDevice: 'Вимкнено',
    expires: 'Закінчується',
    openMarket: 'Відкрити маркет',
    links: 'Спільнота',
    channel: 'Telegram канал',
    chat: 'Telegram чат',
    bot: 'Telegram бот',
    twitter: 'X / Twitter',
    dashboard: 'Панель профілю',
    wallet: 'Гаманець',
    notConnected: 'Не підключено',
    statusLabel: 'СТАТУС',
    telegramProfile: 'Telegram профіль',
    guideTitle: 'Як активувати VPN',
    wgOfficial: 'Відкрити WireGuard Official',
    plans: 'VPN тарифи',
    subActive: 'Підписка активна',
    protocol: 'VPN протокол',
    wireguardDesc: 'Швидкий • Легкий • За замовчуванням',
    amneziaDesc: 'Кращий обхід • Антиблокування • Smart routing',
    recommendedUse: 'Рекомендоване використання',
    generatedFile: 'Формат файлу',
    wgRecommended: 'Щоденний VPN-доступ через офіційний застосунок WireGuard.',
    amRecommended: 'Мережі з блокуваннями або DPI, де AWG допомагає обходити фільтри.',
    holderFree: 'Холдер / безкоштовно',
    holderDuration: 'Безкоштовний VPN-доступ для холдерів',
    comingSoon: 'Скоро',
    marketIntro: 'Купуй додатковий VPN-доступ навіть якщо ти вже холдер. Платні тарифи дають більше пристроїв і довший доступ.',
    month1: '1 місяць',
    month3: '3 місяці',
    month12: '12 місяців',
    days30: '30 днів VPN-доступу',
    days90: '90 днів VPN-доступу',
    days365: '365 днів VPN-доступу',
    devicesCount: 'пристрої',
    bestOne: 'Найкраще для тесту PLANKTON VPN на телефоні та ноутбуці.',
    bestThree: 'Оптимальний баланс для щоденного використання та кількох пристроїв.',
    bestYear: 'Найкраща пропозиція для активних користувачів і довгого доступу.',
    featureProtocols: 'WireGuard + Amnezia',
    featureDevices: 'Мобільний + ПК',
    featureExpiry: 'Автовимкнення після завершення доступу',
    featureTelegram: 'Доступ прямо через Telegram',
    deviceLimitLine: 'Ліміт пристроїв',
    activeVpnDevices: 'активних VPN пристроїв',
    protocolsIncluded: 'WireGuard і Amnezia VPN включені.',
    holderDeviceBadge: '1 WireGuard + 1 Amnezia',
    payTon: 'Оплатити TON',
    payPlankton: 'Оплатити $PLANKTON',
    pricesPoweredBy: 'Ціни оновлюються через',
    priceTonLabel: 'TON',
    pricePlanktonLabel: '$PLANKTON',
    guideWireguardDesc: 'Швидкий, легкий та основний VPN-протокол.',
    guideAmneziaDesc: 'Краще для обходу блокувань, антиблокінгу та AWG профілю.',
    guideLimitsTitle: 'Ліміти пристроїв',
    wgStep1: 'Встанови офіційний застосунок WireGuard.',
    wgStep2: 'Відкрий вкладку VPN і вибери WireGuard.',
    wgStep3: 'Створи та завантаж .conf файл.',
    wgStep4: 'Імпортуй файл у WireGuard і увімкни тунель.',
    amStep1: 'Встанови Amnezia VPN з офіційного сайту або app store.',
    amStep2: 'Відкрий вкладку VPN і вибери Amnezia VPN.',
    amStep3: 'Створи та завантаж .awg профіль.',
    amStep4: 'Імпортуй .awg профіль в Amnezia і увімкни VPN.',
    openAmnezia: 'Відкрити Amnezia Official',
    limitHolder: 'Холдерський доступ дає 1 пристрій WireGuard і 1 пристрій Amnezia.',
    limitOne: 'Тариф 1 місяць дає 2 VPN пристрої.',
    limitThree: 'Тариф 3 місяці дає 3 VPN пристрої.',
    limitYear: 'Тариф 12 місяців дає 5 VPN пристроїв.',
    connectWalletDevices: 'Підключи гаманець, щоб побачити пристрої.',
    loadingDevices: 'Завантаження пристроїв...',
    noIp: 'Немає IP',
    privateVpnAccess: 'Приватний VPN-доступ',
    stableMobileConfig: 'Стабільний мобільний конфіг',
    autoDisabledExpires: 'Автовимкнення після завершення доступу',
    installProtocol: 'Встановити',
    confConfig: '.conf конфіг',
    awgProfile: '.awg профіль',
    referralTitle: 'Реферальна програма',
    referralSubtitle: 'Запрошуй друзів і заробляй з платних VPN-підписок.',
    referralReward: '5 активних платних рефералів → 1 рік VPN безкоштовно',
    totalReferrals: 'Усього рефералів',
    activePaid: 'Активних платних',
    earnedTon: 'Зароблено TON',
    freeYearProgress: 'Прогрес до безкоштовного року',
    inviteFriend: 'Запросити друга',
    copy: 'Копіювати',
    withdrawals: 'Виведення від 1 TON за заявкою та ручним схваленням адміна.',
    referralShareText: 'Підключайся до PLANKTON VPN і отримай приватний VPN-доступ через TON / $PLANKTON.',
    referralLoading: 'Готуємо реферальний код...',
    copied: 'Реферальне посилання скопійовано',
    copyFailed: 'Не вдалося скопіювати посилання',
    connectWalletFirst: 'Спочатку підключи гаманець',
    telegramUserFallback: 'Telegram користувач',
    deleteConfirm: 'Видалити цей VPN пристрій?',
    deleteFailed: 'Не вдалося видалити пристрій',
    paymentWalletMissing: 'Гаманець для оплати не вказаний',
    paymentCreationFailed: 'Не вдалося створити платіж',
    planktonWalletMissing: 'Не вдалося знайти твій PLANKTON wallet. Переконайся, що маєш $PLANKTON.',
    planktonPaymentConfirmed: '$PLANKTON платіж підтверджено. VPN підписку активовано.',
    tonPaymentConfirmed: 'TON платіж підтверджено. VPN підписку активовано.',
    paymentPending: 'Платіж відправлено, але ще не підтверджено. Зачекай трохи і перевір доступ знову.',
    paymentFailed: 'Платіж скасовано або не пройшов',
    vpnCreateFailed: 'Не вдалося створити VPN конфіг',
    deviceLimitTitle: 'Досягнуто ліміт пристроїв.',
    currentLimit: 'Поточний ліміт',
    usedDevices: 'Використано',
    upgradeMarket: 'Відкрий маркет, щоб покращити тариф і додати пристрої.',
    configReady: 'Конфіг готовий',
    error: 'Помилка',
    guideFaqTitle: 'Вирішення проблем',
    faqAmneziaConflictTitle: 'WG-конфіг відкривається в Amnezia замість WireGuard',
    faqStep1: 'Відкрийте застосунок WireGuard на iPhone',
    faqStep2: 'Натисніть ➕ у правому верхньому куті',
    faqStep3: 'Виберіть «Створити з файлу або архіву»',
    faqStep4: 'Знайдіть .conf файл у Завантаженнях і підтвердьте імпорт',
  },
  zh: {
    title: 'PLANKTON VPN',
    subtitle: '面向 $PLANKTON 社区的私密 VPN 访问。',
    hold: '持有 1,000,000 $PLANKTON 即可解锁免费 VPN。',
    check: '检查权限',
    checking: '检查中...',
    active: 'VPN 已激活',
    locked: '访问受限',
    buy: '购买 $PLANKTON',
    install: '安装',
    generate: '生成配置',
    download: '下载配置',
    downloadWireguard: '下载 WireGuard .conf',
    downloadAmnezia: '下载 Amnezia .awg',
    openConfigBrowser: '在浏览器中打开配置',
    configOpenNote: 'iPhone：如果文件错误地在 Amnezia 中打开，请打开 WireGuard 应用 → 点击 ➕ → "从文件或归档创建" → 从下载中选择 .conf 文件。',
    home: '首页',
    vpn: 'VPN',
    guide: '指南',
    profile: '我的',
    market: '市场',
    devices: '我的 VPN 设备',
    noDevices: '暂无 VPN 设备',
    refresh: '刷新',
    deleteDevice: '删除',
    activeDevice: '已启用',
    disabledDevice: '已禁用',
    expires: '到期',
    openMarket: '打开市场',
    links: '社区',
    channel: 'Telegram 频道',
    chat: 'Telegram 群聊',
    bot: 'Telegram 机器人',
    twitter: 'X / Twitter',
    dashboard: '个人面板',
    wallet: '钱包',
    notConnected: '未连接',
    statusLabel: '状态',
    telegramProfile: 'Telegram 资料',
    guideTitle: '如何激活 VPN',
    wgOfficial: '打开 WireGuard 官网',
    plans: 'VPN 套餐',
    subActive: '订阅已激活',
    protocol: 'VPN 协议',
    wireguardDesc: '快速 • 轻量 • 默认',
    amneziaDesc: '更好绕过 • 抗封锁 • 智能路由',
    recommendedUse: '推荐用途',
    generatedFile: '生成文件',
    wgRecommended: '使用官方 WireGuard 应用进行日常 VPN 访问。',
    amRecommended: '适合存在封锁或 DPI、需要 AWG 绕过过滤的网络。',
    holderFree: '持有者 / 免费',
    holderDuration: '持有者免费 VPN 访问',
    comingSoon: '即将推出',
    marketIntro: '即使你已经是持有者，也可以购买额外 VPN 权限。付费套餐可解锁更多设备和更长访问时间。',
    month1: '1 个月',
    month3: '3 个月',
    month12: '12 个月',
    days30: '30 天 VPN 访问',
    days90: '90 天 VPN 访问',
    days365: '365 天 VPN 访问',
    devicesCount: '台设备',
    bestOne: '适合在手机和笔记本上测试 PLANKTON VPN。',
    bestThree: '适合日常使用和多设备的平衡选择。',
    bestYear: '最划算，适合重度用户和长期访问。',
    featureProtocols: 'WireGuard + Amnezia',
    featureDevices: '手机 + 桌面端',
    featureExpiry: '到期自动禁用',
    featureTelegram: 'Telegram 原生访问',
    deviceLimitLine: '设备限制',
    activeVpnDevices: '台活跃 VPN 设备',
    protocolsIncluded: '包含 WireGuard 和 Amnezia VPN。',
    holderDeviceBadge: '1 WireGuard + 1 Amnezia',
    payTon: '支付 TON',
    payPlankton: '支付 $PLANKTON',
    pricesPoweredBy: '价格由以下服务提供',
    priceTonLabel: 'TON',
    pricePlanktonLabel: '$PLANKTON',
    guideWireguardDesc: '快速、轻量、默认 VPN 协议。',
    guideAmneziaDesc: '更适合绕过封锁、抗干扰和 AWG 配置。',
    guideLimitsTitle: '设备限制',
    wgStep1: '安装官方 WireGuard 应用。',
    wgStep2: '打开 VPN 标签并选择 WireGuard。',
    wgStep3: '生成并下载 .conf 文件。',
    wgStep4: '将文件导入 WireGuard 并开启隧道。',
    amStep1: '从官网或应用商店安装 Amnezia VPN。',
    amStep2: '打开 VPN 标签并选择 Amnezia VPN。',
    amStep3: '生成并下载 .awg 配置。',
    amStep4: '将 .awg 配置导入 Amnezia 并开启 VPN。',
    openAmnezia: '打开 Amnezia 官网',
    limitHolder: '持有者权限提供 1 台 WireGuard 设备和 1 台 Amnezia 设备。',
    limitOne: '1 个月套餐提供 2 台 VPN 设备。',
    limitThree: '3 个月套餐提供 3 台 VPN 设备。',
    limitYear: '12 个月套餐提供 5 台 VPN 设备。',
    connectWalletDevices: '连接钱包以查看你的设备。',
    loadingDevices: '正在加载设备...',
    noIp: '无 IP',
    privateVpnAccess: '私密 VPN 访问',
    stableMobileConfig: '稳定移动端配置',
    autoDisabledExpires: '访问到期自动禁用',
    installProtocol: '安装',
    confConfig: '.conf 配置',
    awgProfile: '.awg 配置',
    referralTitle: '推荐计划',
    referralSubtitle: '邀请朋友并从付费 VPN 订阅中赚取奖励。',
    referralReward: '5 个活跃付费推荐 → 免费 1 年 VPN',
    totalReferrals: '推荐总数',
    activePaid: '活跃付费',
    earnedTon: '已赚 TON',
    freeYearProgress: '免费一年进度',
    inviteFriend: '邀请朋友',
    copy: '复制',
    withdrawals: '1 TON 起提现，由管理员手动审核。',
    referralShareText: '加入 PLANKTON VPN，用 TON / $PLANKTON 解锁私密 VPN 访问。',
    referralLoading: '正在准备推荐码...',
    copied: '推荐链接已复制',
    copyFailed: '无法复制链接',
    connectWalletFirst: '请先连接钱包',
    telegramUserFallback: 'Telegram 用户',
    deleteConfirm: '删除这个 VPN 设备？',
    deleteFailed: '删除设备失败',
    paymentWalletMissing: '支付钱包未配置',
    paymentCreationFailed: '创建支付失败',
    planktonWalletMissing: '找不到你的 PLANKTON 钱包。请确认你持有 $PLANKTON。',
    planktonPaymentConfirmed: '$PLANKTON 支付已确认。VPN 订阅已激活。',
    tonPaymentConfirmed: 'TON 支付已确认。VPN 订阅已激活。',
    paymentPending: '付款已发送但尚未确认。请稍等片刻后再次检查访问权限。',
    paymentFailed: '付款已取消或失败',
    vpnCreateFailed: '创建 VPN 配置失败',
    deviceLimitTitle: '已达到设备限制。',
    currentLimit: '当前限制',
    usedDevices: '已使用',
    upgradeMarket: '打开市场升级套餐并添加更多设备。',
    configReady: '配置已准备好',
    error: '错误',
    guideFaqTitle: '故障排除',
    faqAmneziaConflictTitle: 'WG 配置在 Amnezia 中打开而不是 WireGuard',
    faqStep1: '在 iPhone 上打开 WireGuard 应用',
    faqStep2: '点击右上角的 ➕',
    faqStep3: '选择"从文件或归档创建"',
    faqStep4: '在下载中找到 .conf 文件并确认导入',
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
  const [configProtocol, setConfigProtocol] = useState<Protocol | null>(null)
  const [devices, setDevices] = useState<VpnDevice[]>([])
  const [devicesLoading, setDevicesLoading] = useState(false)

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => { if (data.plans) setPricingData(data) })
      .catch(() => {})
  }, [])

  function selectProtocol(nextProtocol: Protocol) {
    setProtocol(nextProtocol)
    setConfigUrl('')
    setConfigProtocol(null)
  }

  // Route to plans tab when opened via bot subscription button or deep link
  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search).get('startapp')
    const tgParam  = window.Telegram?.WebApp?.initDataUnsafe?.start_param
    if ((urlParam ?? tgParam) === 'plans') {
      setTab('market')
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
    if (wallet) {
      checkAccess()
      loadDevices()
    } else {
      setDevices([])
    }
  }, [wallet, lang])

  async function loadDevices() {
    if (!wallet) return

    try {
      setDevicesLoading(true)

      const res = await fetch(`/api/vpn/devices?wallet=${encodeURIComponent(wallet)}`, {
        cache: 'no-store',
      })
      const data = await res.json()

      if (data.ok && Array.isArray(data.devices)) {
        setDevices(data.devices)
      } else {
        setDevices([])
      }
    } catch (e) {
      console.error('Load devices error:', e)
      setDevices([])
    }

    setDevicesLoading(false)
  }

  async function deleteDevice(deviceId: string) {
    if (!wallet) return

    const ok = window.confirm(t.deleteConfirm)
    if (!ok) return

    try {
      setDevicesLoading(true)

      const res = await fetch('/api/vpn/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          deviceId,
        }),
      })

      const data = await res.json()

      if (!data.ok) {
        alert(data.error || t.deleteFailed)
        setDevicesLoading(false)
        return
      }

      await loadDevices()
    } catch (e) {
      console.error('Delete device error:', e)
      alert(t.deleteFailed)
    }

    setDevicesLoading(false)
  }

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
      setStatus(t.error)
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

        if (String(data.error || '').includes('Device limit reached')) {
          alert(
            `${t.deviceLimitTitle}\n\n${t.currentLimit}: ${data.limit || 1}\n${t.usedDevices}: ${data.used || 0}\n\n${t.upgradeMarket}`,
          )
          setTab('market')
        } else {
          alert(data.error || t.vpnCreateFailed)
        }

        setStatus(data.error || t.vpnCreateFailed)
        setLoading(false)
        return
      }
  
      const deviceName = encodeURIComponent(data.device.name)
  
      const createdProtocol = data.device.protocol === 'amnezia' ? 'amnezia' : 'wireguard'

      setConfigUrl(`/api/vpn/download?name=${deviceName}&protocol=${createdProtocol}`)
      setConfigProtocol(createdProtocol)
      setStatus(t.configReady)
      await loadDevices()
    } catch (e) {
      console.error(e)
      setStatus(t.error)
      alert(t.vpnCreateFailed)
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
        alert(t.planktonWalletMissing)
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
        alert(t.paymentCreationFailed)
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
        alert(t.planktonPaymentConfirmed)
        await checkAccess()
      } else {
        alert(t.paymentPending)
      }
    } catch (e) {
      console.error(e)
      alert(t.paymentFailed)
    }

    setLoading(false)
  }

  async function payWithTon(plan: string) {
    if (!wallet) return

    const receiver = process.env.NEXT_PUBLIC_PAYMENT_WALLET
    if (!receiver) {
      alert(t.paymentWalletMissing)
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
        alert(t.paymentCreationFailed)
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
        alert(t.tonPaymentConfirmed)
        await checkAccess()
      } else {
        alert(t.paymentPending)
      }
    } catch (e) {
      console.error(e)
      alert(t.paymentFailed)
    }

    setLoading(false)
  }

  return (
    <div style={shell}>
      {showSplash && <Splash />}

      <div style={frame}>
        <div style={wrap}>
          <div style={card}>
            <Header lang={lang} setLang={setLang} setTab={setTab} t={t} />

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
                        label={t.statusLabel}
                        value={status}
                        color={hasAccess ? '#39f58f' : '#ff6b6b'}
                      />
                    </div>

                    {(!hasAccess || forcePlans) && (
                      <>
                        <a href={BUY_URL} target="_blank" style={buyBtn}>
                          {t.buy}
                        </a>

                        <button type="button" onClick={() => setTab('market')} style={blueBtn}>
                          {t.openMarket}
                        </button>
                      </>
                    )}

                    {hasAccess && (
                      <div style={setupCard}>
                        <ProtocolSelector
                          t={t}
                          protocol={protocol}
                          setProtocol={selectProtocol}
                        />

                        <ProtocolSetupPanel
                          protocol={protocol}
                          t={t}
                          loading={loading}
                          generateConfig={generateConfig}
                          configUrl={configUrl}
                          configProtocol={configProtocol}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {tab === 'market' && (
              <>
                <Hero t={t} />

                <div style={walletCard}>
                  <TonConnectButton />
                  {wallet && <div style={walletText}>{wallet}</div>}
                </div>

                <PlansBlock
                  t={t}
                  loading={loading}
                  createPlan={createPlan}
                  payWithTon={payWithTon}
                  pricingData={pricingData}
                />
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
                devices={devices}
                devicesLoading={devicesLoading}
                loadDevices={loadDevices}
                deleteDevice={deleteDevice}
              />
            )}
          </div>
        </div>
      </div>

      <div style={nav}>
        <NavBtn active={tab === 'home'} label={t.home} icon="⌂" onClick={() => setTab('home')} />
        <NavBtn active={tab === 'vpn'} label={t.vpn} icon="◆" onClick={() => setTab('vpn')} />
        <NavBtn active={tab === 'market'} label={t.market} icon="◇" onClick={() => setTab('market')} />
        <NavBtn active={tab === 'profile'} label={t.profile} icon="●" onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}


function ProtocolSelector({ t, protocol, setProtocol }: any) {
  const options = [
    {
      id: 'wireguard',
      title: 'WireGuard',
      desc: t.wireguardDesc,
      recommended: t.wgRecommended,
      fileType: t.confConfig,
    },
    {
      id: 'amnezia',
      title: 'Amnezia VPN',
      desc: t.amneziaDesc,
      recommended: t.amRecommended,
      fileType: t.awgProfile,
    },
  ]

  return (
    <div style={protocolWrap}>
      <div style={sectionTitle}>{t.protocol}</div>

      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setProtocol(option.id)}
          style={{ ...protocolCard, ...(protocol === option.id ? protocolCardActive : {}) }}
        >
          <div style={protocolName}>{option.title}</div>
          <div style={muted}>{option.desc}</div>
          <div style={protocolDetail}>{t.recommendedUse}: {option.recommended}</div>
          <div style={protocolDetail}>{t.generatedFile}: {option.fileType}</div>
        </button>
      ))}
    </div>
  )
}

function PlansBlock({ t, loading, createPlan, payWithTon, pricingData }: any) {
  const [selectedPlan, setSelectedPlan] = useState('ONE_MONTH')

  const plans = [
    {
      key: 'ONE_MONTH',
      label: t.month1,
      duration: t.days30,
      devices: 2,
      tonUsd: 3,
      planktonUsd: 2,
      bestFor: t.bestOne,
    },
    {
      key: 'THREE_MONTHS',
      label: t.month3,
      duration: t.days90,
      devices: 3,
      tonUsd: 7,
      planktonUsd: 5,
      bestFor: t.bestThree,
    },
    {
      key: 'TWELVE_MONTHS',
      label: t.month12,
      duration: t.days365,
      devices: 5,
      tonUsd: 20,
      planktonUsd: 14,
      bestFor: t.bestYear,
    },
  ]

  return (
    <div style={setupCard}>
      <div style={sectionTitle}>{t.plans}</div>
      <div style={marketIntro}>{t.marketIntro}</div>

      <div style={planCardPremium}>
        <div style={planPremiumTop}>
          <div>
            <div style={planTitle}>{t.holderFree}</div>
            <div style={muted}>{t.holderDuration}</div>
          </div>
          <div style={planDeviceBadge}>{t.holderDeviceBadge}</div>
        </div>

        <div style={planFeatureGrid}>
          <div style={planFeature}>{t.featureProtocols}</div>
          <div style={planFeature}>{t.featureDevices}</div>
          <div style={planFeature}>{t.featureExpiry}</div>
          <div style={planFeature}>{t.featureTelegram}</div>
        </div>

        <div style={planDetailsBox}>
          <div style={planDetailsText}>{t.limitHolder}</div>
          <div style={planDetailsText}>{t.protocolsIncluded}</div>
        </div>
      </div>

      {plans.map(({ key, label, duration, devices, tonUsd, planktonUsd, bestFor }) => {
        const api = pricingData?.plans?.find((p: any) => p.plan === key)
        const tonLine = api ? `${api.tonDisplay} TON ≈ $${tonUsd}` : `${t.priceTonLabel}: $${tonUsd}`
        const planktonLine = api
          ? `${api.planktonDisplay} $PLANKTON ≈ $${planktonUsd}`
          : `${t.pricePlanktonLabel}: $${planktonUsd}`
        const active = selectedPlan === key

        return (
          <div
            key={key}
            onClick={() => setSelectedPlan(key)}
            style={{ ...planCardPremium, ...(active ? planCardPremiumActive : {}) }}
          >
            <div style={planPremiumTop}>
              <div>
                <div style={planTitle}>{label}</div>
                <div style={muted}>{duration}</div>
              </div>
              <div style={planDeviceBadge}>{devices} {t.devicesCount}</div>
            </div>

            <div style={planFeatureGrid}>
              <div style={planFeature}>{t.featureProtocols}</div>
              <div style={planFeature}>{t.featureDevices}</div>
              <div style={planFeature}>{t.featureExpiry}</div>
              <div style={planFeature}>{t.featureTelegram}</div>
            </div>

            {active && (
              <div style={planDetailsBox}>
                <div style={planDetailsText}>{bestFor}</div>
                <div style={planDetailsText}>{t.deviceLimitLine}: {devices} {t.activeVpnDevices}.</div>
                <div style={planDetailsText}>{t.protocolsIncluded}</div>
              </div>
            )}

            <div style={planPriceBox}>
              <div>
                <div style={muted}>{tonLine}</div>
                <div style={muted}>{planktonLine}</div>
              </div>
            </div>

            <div style={planButtons} onClick={(e) => e.stopPropagation()}>
              <button disabled={loading} onClick={() => payWithTon(key)} style={smallGreenBtn}>
                {t.payTon}
              </button>
              <button disabled={loading} onClick={() => createPlan(key, 'PLANKTON')} style={smallBlueBtn}>
                {t.payPlankton}
              </button>
            </div>
          </div>
        )
      })}

      <div style={poweredBy}>
        {t.pricesPoweredBy}{' '}
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

function Header({ lang, setLang, setTab, t }: any) {
  return (
    <div style={topRow}>
      <div style={badge}>CEO PLANKTON</div>

      <div style={topActions}>
        <button type="button" onClick={() => setTab('guide')} style={guideTopBtn}>
          ? {t.guide}
        </button>

        <select value={lang} onChange={(e) => setLang(e.target.value)} style={select}>
          <option value="en">🇺🇸 EN</option>
          <option value="ru">🇷🇺 RU</option>
          <option value="ua">🇺🇦 UA</option>
          <option value="zh">🇨🇳 中文</option>
        </select>
      </div>
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

      <a href={TG_BOT_URL} target="_blank" style={linkBtn}>
        ◆ {t.bot}
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

      <div style={guideProtocolCard}>
        <div style={guideProtocolTitle}>WireGuard</div>
        <div style={muted}>{t.guideWireguardDesc}</div>
        <GuideStep n="1" text={t.wgStep1} />
        <GuideStep n="2" text={t.wgStep2} />
        <GuideStep n="3" text={t.wgStep3} />
        <GuideStep n="4" text={t.wgStep4} />
        <a href={WIREGUARD_URL} target="_blank" style={downloadBtn}>
          ⬇ {t.wgOfficial}
        </a>
      </div>

      <div style={guideProtocolCard}>
        <div style={guideProtocolTitle}>Amnezia VPN</div>
        <div style={muted}>{t.guideAmneziaDesc}</div>
        <GuideStep n="1" text={t.amStep1} />
        <GuideStep n="2" text={t.amStep2} />
        <GuideStep n="3" text={t.amStep3} />
        <GuideStep n="4" text={t.amStep4} />
        <a href="https://amnezia.org/" target="_blank" rel="noopener" style={downloadBtn}>
          ⬇ {t.openAmnezia}
        </a>
      </div>

      <div style={guideProtocolCard}>
        <div style={guideProtocolTitle}>{t.guideFaqTitle}</div>
        <div style={muted}>{t.faqAmneziaConflictTitle}</div>
        <GuideStep n="1" text={t.faqStep1} />
        <GuideStep n="2" text={t.faqStep2} />
        <GuideStep n="3" text={t.faqStep3} />
        <GuideStep n="4" text={t.faqStep4} />
      </div>

      <div style={guideProtocolCard}>
        <div style={guideProtocolTitle}>{t.guideLimitsTitle}</div>
        <GuideStep n="1" text={t.limitHolder} />
        <GuideStep n="2" text={t.limitOne} />
        <GuideStep n="3" text={t.limitThree} />
        <GuideStep n="4" text={t.limitYear} />
      </div>
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

function Profile({ t, telegramUser, wallet, balance, status, hasAccess, devices, devicesLoading, loadDevices, deleteDevice }: any) {
  const name =
    telegramUser?.username
      ? `@${telegramUser.username}`
      : [telegramUser?.first_name, telegramUser?.last_name].filter(Boolean).join(' ') ||
        t.telegramUserFallback

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
          <div style={muted}>{t.telegramProfile}</div>
        </div>
      </div>

      <div style={stats}>
        <InfoCard label="$PLANKTON" value={balance.toLocaleString()} />
        <InfoCard label="VPN" value={status} color={hasAccess ? '#39f58f' : '#ff6b6b'} />
      </div>

      <div style={profileBlock}>
        <div style={profileLabel}>{t.wallet}</div>
        <div style={profileValue}>{wallet || t.notConnected}</div>
      </div>

      <MyVpnDevices
        t={t}
        wallet={wallet}
        devices={devices}
        devicesLoading={devicesLoading}
        loadDevices={loadDevices}
        deleteDevice={deleteDevice}
      />

      <ReferralProgram wallet={wallet} t={t} />
    </div>
  )
}

function MyVpnDevices({ t, wallet, devices, devicesLoading, loadDevices, deleteDevice }: any) {
  return (
    <div style={devicesWrap}>
      <div style={devicesHeader}>
        <div style={sectionTitle}>{t.devices}</div>

        {wallet && (
          <button type="button" onClick={loadDevices} disabled={devicesLoading} style={refreshBtn}>
            ↻
          </button>
        )}
      </div>

      {!wallet && <div style={emptyDevices}>{t.connectWalletDevices}</div>}

      {wallet && devicesLoading && devices.length === 0 && (
        <div style={emptyDevices}>{t.loadingDevices}</div>
      )}

      {wallet && !devicesLoading && devices.length === 0 && (
        <div style={emptyDevices}>{t.noDevices}</div>
      )}

      {wallet && devices.map((device: VpnDevice) => {
        const protocolId = device.protocol === 'amnezia' ? 'amnezia' : 'wireguard'
        const deviceProtocol = protocolId === 'amnezia' ? 'Amnezia' : 'WireGuard'
        const deviceFile = `/api/vpn/download?name=${encodeURIComponent(device.name)}&protocol=${protocolId}`
        const downloadLabel = protocolId === 'amnezia' ? t.downloadAmnezia : t.downloadWireguard
        const expiresAt = device.expiresAt
          ? new Date(device.expiresAt).toLocaleDateString()
          : '—'

        return (
          <div key={device.id} style={deviceCard}>
            <div style={deviceTop}>
              <div>
                <div style={deviceName}>{device.name}</div>
                <div style={deviceMeta}>{deviceProtocol} • {device.address || t.noIp}</div>
              </div>

              <div
                style={{
                  ...deviceStatus,
                  color: device.enabled ? '#39f58f' : '#ff6b6b',
                  borderColor: device.enabled ? 'rgba(57,245,143,.35)' : 'rgba(255,107,107,.35)',
                }}
              >
                {device.enabled ? t.activeDevice : t.disabledDevice}
              </div>
            </div>

            <div style={deviceExpire}>{t.expires}: {expiresAt}</div>

            <div style={deviceActions}>
              <a href={deviceFile} target="_blank" rel="noopener" style={deviceDownloadBtn}>
                📄 {downloadLabel}
              </a>

              <a href={deviceFile} target="_blank" rel="noopener" style={deviceOpenBtn}>
                ↗ {t.openConfigBrowser}
              </a>
            </div>

            <div style={deviceDownloadNote}>{t.configOpenNote}</div>

            <div style={deviceActions}>
              <button
                type="button"
                onClick={() => deleteDevice(device.id)}
                disabled={devicesLoading}
                style={deviceDeleteBtn}
              >
                🗑 {t.deleteDevice}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}


function ProtocolSetupPanel({ protocol, t, loading, generateConfig, configUrl, configProtocol }: any) {
  const isAmnezia = protocol === 'amnezia'
  const title = isAmnezia ? 'Amnezia VPN' : 'WireGuard'
  const desc = isAmnezia ? t.amneziaDesc : t.wireguardDesc
  const installUrl = isAmnezia ? 'https://amnezia.org/' : WIREGUARD_URL
  const fileType = isAmnezia ? t.awgProfile : t.confConfig
  const logo = isAmnezia ? '/amnezia-logo.png' : '/assets/wireguard-logo.png'
  const canDownload = configUrl && configProtocol === protocol
  const downloadLabel = isAmnezia ? t.downloadAmnezia : t.downloadWireguard

  return (
    <div style={protocolSetupCard}>
      <div style={protocolSetupHead}>
        <div style={protocolLogoBox}>
          <img src={logo} alt={title} style={protocolLogo} />
        </div>

        <div>
          <div style={wgTitle}>{title}</div>
          <div style={muted}>{desc}</div>
          <div style={protocolBadge}>{fileType}</div>
        </div>
      </div>

      <div style={protocolFeatureGrid}>
        <div style={protocolFeature}>{t.recommendedUse}: {isAmnezia ? t.amRecommended : t.wgRecommended}</div>
        <div style={protocolFeature}>{t.generatedFile}: {fileType}</div>
        <div style={protocolFeature}>{t.privateVpnAccess}</div>
        <div style={protocolFeature}>{t.stableMobileConfig}</div>
        <div style={protocolFeature}>{t.autoDisabledExpires}</div>
      </div>

      <a href={installUrl} target="_blank" rel="noopener" style={outlineBtn}>
        ⬇ {t.installProtocol} {title}
      </a>

      <button onClick={generateConfig} disabled={loading} style={greenBtn}>
        ⚙ {loading ? t.checking : t.generate}
      </button>

      {canDownload && (
        <>
          <a href={configUrl} target="_blank" rel="noopener" style={downloadBtn}>
            📄 {downloadLabel}
          </a>
          <a href={configUrl} target="_blank" rel="noopener" style={outlineBtn}>
            ↗ {t.openConfigBrowser}
          </a>
          <div style={downloadNote}>{t.configOpenNote}</div>
        </>
      )}
    </div>
  )
}

function ReferralProgram({ wallet, t }: any) {
  const [referralLink, setReferralLink] = useState('')
  const [referralLoading, setReferralLoading] = useState(false)
  const activePaidRefs = 0
  const totalRefs = 0
  const earnedTon = 0
  const freeYearTarget = 5
  const progress = Math.min(activePaidRefs, freeYearTarget)
  const shareText = t.referralShareText

  useEffect(() => {
    if (!wallet) {
      setReferralLink('')
      return
    }

    let cancelled = false

    async function loadReferral() {
      try {
        setReferralLoading(true)
        const res = await fetch(`/api/referral/me?wallet=${encodeURIComponent(wallet)}`, {
          cache: 'no-store',
        })
        const data = await res.json()

        if (!cancelled && data.ok && data.referralLink) {
          setReferralLink(data.referralLink)
        }
      } catch (e) {
        console.error('Referral load error:', e)
        if (!cancelled) setReferralLink('')
      } finally {
        if (!cancelled) setReferralLoading(false)
      }
    }

    loadReferral()

    return () => {
      cancelled = true
    }
  }, [wallet])

  async function copyReferral() {
    if (!wallet) {
      alert(t.connectWalletFirst)
      return
    }

    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)
      alert(t.copied)
    } catch {
      alert(t.copyFailed)
    }
  }

  function shareReferral() {
    if (!wallet) {
      alert(t.connectWalletFirst)
      return
    }

    if (!referralLink) return

    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  return (
    <div style={referralCard}>
      <div style={referralTop}>
        <div>
          <div style={sectionTitle}>{t.referralTitle}</div>
          <div style={muted}>{t.referralSubtitle}</div>
        </div>
        <div style={referralBadge}>10%</div>
      </div>

      <div style={referralRewardPill}>{t.referralReward}</div>

      {wallet && referralLoading && (
        <div style={referralSmallText}>{t.referralLoading}</div>
      )}

      <div style={referralStatsGrid}>
        <div style={referralStatBox}>
          <div style={referralStatValue}>{totalRefs}</div>
          <div style={referralStatLabel}>{t.totalReferrals}</div>
        </div>
        <div style={referralStatBox}>
          <div style={referralStatValue}>{activePaidRefs}</div>
          <div style={referralStatLabel}>{t.activePaid}</div>
        </div>
        <div style={referralStatBox}>
          <div style={referralStatValue}>{earnedTon}</div>
          <div style={referralStatLabel}>{t.earnedTon}</div>
        </div>
      </div>

      <div style={progressWrap}>
        <div style={progressTopLine}>
          <span>{t.freeYearProgress}</span>
          <span>{progress}/{freeYearTarget}</span>
        </div>
        <div style={progressSlots}>
          {Array.from({ length: freeYearTarget }).map((_, i) => (
            <div key={i} style={{ ...progressSlot, ...(i < progress ? progressSlotActive : {}) }} />
          ))}
        </div>
      </div>

      <div style={referralActions}>
        <button type="button" onClick={shareReferral} disabled={referralLoading || !referralLink} style={referralShareBtn}>
          {t.inviteFriend}
        </button>
        <button type="button" onClick={copyReferral} disabled={referralLoading || !referralLink} style={referralCopyBtn}>
          {t.copy}
        </button>
      </div>

      <div style={referralSmallText}>{t.withdrawals}</div>
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

const topActions: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const guideTopBtn: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(255,255,255,.06)',
  color: '#fff',
  borderRadius: 14,
  padding: '8px 10px',
  fontWeight: 900,
  fontSize: 12,
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

const downloadNote: React.CSSProperties = {
  color: '#8fa3b8',
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.35,
  marginTop: 2,
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

const protocolDetail: React.CSSProperties = {
  marginTop: 8,
  color: '#b7c8dc',
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.35,
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

const devicesWrap: React.CSSProperties = {
  marginTop: 14,
}

const devicesHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
}

const refreshBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(255,255,255,.06)',
  color: '#50d4ff',
  fontWeight: 1000,
  fontSize: 18,
}

const emptyDevices: React.CSSProperties = {
  borderRadius: 18,
  padding: 14,
  background: 'rgba(255,255,255,.045)',
  border: '1px solid rgba(255,255,255,.07)',
  color: '#8fa3b8',
  fontSize: 13,
  fontWeight: 800,
}

const deviceCard: React.CSSProperties = {
  borderRadius: 20,
  padding: 14,
  background: 'rgba(255,255,255,.055)',
  border: '1px solid rgba(255,255,255,.08)',
  marginBottom: 10,
}

const deviceTop: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 10,
}

const deviceName: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 1000,
  color: '#fff',
  wordBreak: 'break-word',
}

const deviceMeta: React.CSSProperties = {
  marginTop: 5,
  color: '#8fa3b8',
  fontSize: 12,
  fontWeight: 800,
}

const deviceStatus: React.CSSProperties = {
  flexShrink: 0,
  border: '1px solid rgba(57,245,143,.35)',
  borderRadius: 999,
  padding: '6px 9px',
  fontSize: 11,
  fontWeight: 1000,
  background: 'rgba(0,0,0,.18)',
}

const deviceExpire: React.CSSProperties = {
  marginTop: 10,
  color: '#77889a',
  fontSize: 12,
  fontWeight: 800,
}

const deviceActions: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginTop: 12,
}

const deviceDownloadBtn: React.CSSProperties = {
  minHeight: 42,
  borderRadius: 14,
  background: 'linear-gradient(90deg,#0098ea,#54d8ff)',
  color: '#00111d',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 1000,
  fontSize: 13,
}

const deviceOpenBtn: React.CSSProperties = {
  ...deviceDownloadBtn,
  background: 'rgba(255,255,255,.06)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,.12)',
}

const deviceDownloadNote: React.CSSProperties = {
  color: '#8fa3b8',
  fontSize: 11,
  fontWeight: 800,
  lineHeight: 1.35,
  marginTop: 8,
}

const deviceDeleteBtn: React.CSSProperties = {
  minHeight: 42,
  border: 0,
  borderRadius: 14,
  background: 'rgba(255,107,107,.14)',
  color: '#ff8d8d',
  fontWeight: 1000,
  fontSize: 13,
}


const marketIntro: React.CSSProperties = {
  color: '#8fa3b8',
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.35,
  marginBottom: 12,
}

const planCardPremium: React.CSSProperties = {
  borderRadius: 22,
  padding: 14,
  background: 'rgba(255,255,255,.055)',
  border: '1px solid rgba(255,255,255,.08)',
  marginBottom: 12,
  cursor: 'pointer',
}

const planCardPremiumActive: React.CSSProperties = {
  border: '1px solid rgba(80,212,255,.65)',
  boxShadow: '0 0 24px rgba(0,152,234,.15)',
  background: 'linear-gradient(180deg,rgba(0,152,234,.15),rgba(255,255,255,.055))',
}

const planPremiumTop: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 10,
}

const planDeviceBadge: React.CSSProperties = {
  flexShrink: 0,
  borderRadius: 999,
  padding: '6px 10px',
  background: 'rgba(24,245,138,.12)',
  color: '#55f7a0',
  fontSize: 11,
  fontWeight: 1000,
  border: '1px solid rgba(24,245,138,.25)',
}

const planFeatureGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginTop: 12,
}

const planFeature: React.CSSProperties = {
  borderRadius: 14,
  padding: '9px 10px',
  background: 'rgba(0,0,0,.16)',
  color: '#b7c8dc',
  fontSize: 11,
  fontWeight: 850,
}

const planDetailsBox: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 16,
  padding: 12,
  background: 'rgba(0,152,234,.10)',
  border: '1px solid rgba(80,212,255,.15)',
}

const planDetailsText: React.CSSProperties = {
  color: '#b7c8dc',
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.35,
  marginBottom: 5,
}

const planPriceBox: React.CSSProperties = {
  marginTop: 12,
}

const protocolSetupCard: React.CSSProperties = {
  borderRadius: 24,
  padding: 14,
  background: 'rgba(0,152,234,.10)',
  border: '1px solid rgba(80,212,255,.18)',
}

const protocolSetupHead: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 14,
}

const protocolLogoBox: React.CSSProperties = {
  width: 78,
  height: 78,
  minWidth: 78,
  borderRadius: 24,
  overflow: 'hidden',
  background: 'rgba(255,255,255,.92)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const protocolLogo: React.CSSProperties = {
  width: 62,
  height: 62,
  objectFit: 'contain',
  display: 'block',
}

const protocolBadge: React.CSSProperties = {
  display: 'inline-flex',
  marginTop: 9,
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(255,255,255,.08)',
  color: '#50d4ff',
  fontSize: 11,
  fontWeight: 1000,
}

const protocolFeatureGrid: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  marginBottom: 12,
}

const protocolFeature: React.CSSProperties = {
  borderRadius: 14,
  padding: '10px 12px',
  background: 'rgba(0,0,0,.16)',
  color: '#b7c8dc',
  fontSize: 12,
  fontWeight: 850,
}

const guideProtocolCard: React.CSSProperties = {
  borderRadius: 22,
  padding: 14,
  background: 'rgba(255,255,255,.045)',
  border: '1px solid rgba(255,255,255,.08)',
  marginBottom: 12,
}

const guideProtocolTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 1000,
  marginBottom: 6,
}

const referralCard: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 24,
  padding: 16,
  background: 'linear-gradient(180deg,rgba(0,152,234,.13),rgba(255,255,255,.05))',
  border: '1px solid rgba(80,212,255,.18)',
}

const referralTop: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
}

const referralBadge: React.CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: 18,
  background: 'linear-gradient(135deg,#19d47b,#54d8ff)',
  color: '#00111d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 1000,
  fontSize: 18,
}

const referralRewardPill: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 999,
  padding: '10px 12px',
  background: 'rgba(24,245,138,.10)',
  border: '1px solid rgba(24,245,138,.22)',
  color: '#55f7a0',
  fontSize: 12,
  fontWeight: 1000,
}

const referralStatsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3,1fr)',
  gap: 8,
  marginTop: 12,
}

const referralStatBox: React.CSSProperties = {
  borderRadius: 18,
  padding: 12,
  background: 'rgba(0,0,0,.17)',
  border: '1px solid rgba(255,255,255,.07)',
}

const referralStatValue: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 1000,
}

const referralStatLabel: React.CSSProperties = {
  marginTop: 5,
  color: '#8fa3b8',
  fontSize: 10,
  fontWeight: 900,
  lineHeight: 1.2,
}

const progressWrap: React.CSSProperties = {
  marginTop: 13,
}

const progressTopLine: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#b7c8dc',
  fontSize: 12,
  fontWeight: 900,
  marginBottom: 8,
}

const progressSlots: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5,1fr)',
  gap: 7,
}

const progressSlot: React.CSSProperties = {
  height: 14,
  borderRadius: 999,
  background: 'rgba(255,255,255,.08)',
  border: '1px solid rgba(255,255,255,.08)',
}

const progressSlotActive: React.CSSProperties = {
  background: 'linear-gradient(90deg,#19d47b,#67ffae)',
}

const referralActions: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 82px',
  gap: 10,
  marginTop: 14,
}

const referralShareBtn: React.CSSProperties = {
  height: 52,
  border: 0,
  borderRadius: 18,
  background: 'linear-gradient(90deg,#19d47b,#67ffae)',
  color: '#00120a',
  fontWeight: 1000,
  fontSize: 16,
}

const referralCopyBtn: React.CSSProperties = {
  height: 52,
  border: 0,
  borderRadius: 18,
  background: 'linear-gradient(90deg,#0098ea,#54d8ff)',
  color: '#00111d',
  fontWeight: 1000,
  fontSize: 14,
}

const referralSmallText: React.CSSProperties = {
  marginTop: 10,
  color: '#77889a',
  fontSize: 11,
  fontWeight: 800,
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
