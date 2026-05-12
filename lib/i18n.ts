export const dict = {
  en: {
    navHow: 'How it works', navAccess: 'Access', navBot: 'Telegram Bot', navAdmin: 'Admin',
    heroBadge: 'TON HOLDER VPN / CEO EDITION', title1: 'PLANKTON VPN', title2: 'PRIVATE ACCESS FOR THE OCEAN',
    lead: 'A premium VPN layer for the $PLANKTON community. Connect your TON wallet, verify your holdings, and unlock private internet access.',
    connect: 'Connect TON Wallet', openBot: 'Open Telegram Bot', dashboard: 'Dashboard',
    ticker: ['$PLANKTON HOLDERS', 'TON CONNECT', 'WIREGUARD ACCESS', 'PRIVATE INTERNET', 'CEO OF THE OCEAN'],
    howTitle: 'HOW IT WORKS',
    steps: [['Connect Wallet','Connect your TON wallet with TonConnect.'],['Verify Holdings','The backend checks your $PLANKTON jetton balance.'],['Unlock VPN','Eligible holders receive WireGuard VPN access for 30 days.']],
    accessTitle: 'ACCESS MODEL',
    access: [['First Month Free','Holders receive 30 days of VPN access after verification.'],['Holder Tiers Later','Add Basic, Pro, Elite tiers based on $PLANKTON balance.'],['Subscription Ready','Add paid subscription or holder discount when the product is validated.']],
    botTitle: 'TELEGRAM BOT FLOW',
    bot: ['Start bot', 'Link wallet from website', 'Check access status', 'Receive QR code / config', 'Renew or contact support'],
    securityTitle: 'SECURITY PRINCIPLES',
    security: [['No Seed Phrases','The site never asks users for seed phrases or private keys.'],['Limited Config Access','VPN configs are generated per user and can be revoked.'],['Expiration Control','Backend disables expired peers automatically.']],
    footer: 'Plankton VPN — branded privacy product for the $PLANKTON community.'
  },
  ru: {
    navHow: 'Как работает', navAccess: 'Доступ', navBot: 'Telegram-бот', navAdmin: 'Админка',
    heroBadge: 'VPN ДЛЯ TON-ХОЛДЕРОВ / CEO EDITION', title1: 'PLANKTON VPN', title2: 'ПРИВАТНЫЙ ДОСТУП ДЛЯ ОКЕАНА',
    lead: 'Премиальный VPN-продукт для комьюнити $PLANKTON. Подключи TON-кошелёк, подтверди холд и получи приватный интернет-доступ.',
    connect: 'Подключить TON Wallet', openBot: 'Открыть Telegram-бота', dashboard: 'Кабинет',
    ticker: ['ХОЛДЕРЫ $PLANKTON', 'TON CONNECT', 'WIREGUARD ДОСТУП', 'ПРИВАТНЫЙ ИНТЕРНЕТ', 'CEO OF THE OCEAN'],
    howTitle: 'КАК ЭТО РАБОТАЕТ',
    steps: [['Подключение кошелька','Пользователь подключает TON-кошелёк через TonConnect.'],['Проверка холда','Backend проверяет баланс jetton $PLANKTON.'],['Выдача VPN','Подходящий холдер получает WireGuard-доступ на 30 дней.']],
    accessTitle: 'МОДЕЛЬ ДОСТУПА',
    access: [['Первый месяц бесплатно','Холдер получает 30 дней VPN после проверки.'],['Tier-система позже','Можно добавить Basic, Pro, Elite по балансу $PLANKTON.'],['Готово к подписке','Позже добавим оплату, скидку или доступ за холд.']],
    botTitle: 'ФЛОУ TELEGRAM-БОТА',
    bot: ['Запуск бота', 'Привязка кошелька через сайт', 'Проверка статуса доступа', 'Получение QR-кода / конфига', 'Продление или поддержка'],
    securityTitle: 'ПРИНЦИПЫ БЕЗОПАСНОСТИ',
    security: [['Без seed-фраз','Сайт никогда не просит seed phrase или private key.'],['Отдельный config','VPN-конфиг создаётся отдельно для каждого пользователя и может быть отозван.'],['Контроль срока','Backend автоматически отключает просроченные peer-доступы.']],
    footer: 'Plankton VPN — брендированный privacy-продукт для комьюнити $PLANKTON.'
  }
} as const;
export type Locale = keyof typeof dict;
export function getDict(locale:string){return dict[(locale === 'ru' ? 'ru' : 'en') as Locale]}
