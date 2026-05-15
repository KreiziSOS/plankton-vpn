import type { LocaleData } from './en'

const ua: LocaleData = {
  welcome:
    `🐋 *Ласкаво просимо до Plankton VPN*\n\n` +
    `Приватний VPN\\-доступ для власників $PLANKTON\\.\n\n` +
    `⚡ Швидкі WireGuard\\-сервери\n` +
    `🔐 Оплата через TON або $PLANKTON\n` +
    `🌍 Працює в будь\\-якій країні\n` +
    `🎁 Безкоштовно для власників 1M\\+ $PLANKTON\n\n` +
    `Натисніть *Launch App* щоб почати\\.`,

  btn_launch_app:       'Launch App',
  btn_my_vpn:           'Мій VPN',
  btn_devices:          'Пристрої',
  btn_subscription:     'Підписка',
  btn_help:             'Допомога',
  btn_language:         '🌐 Мова',
  btn_contact_support:  'Написати в підтримку',
  btn_download_config:  'Завантажити конфіг',
  btn_disable:          'Вимкнути',
  btn_enable:           'Увімкнути',
  btn_delete:           'Видалити',

  link_usage:        'Використання: /link АДРЕСА_ГАМАНЦЯ',
  link_already_taken:'Цей гаманець вже прив\'язаний до іншого Telegram-акаунту.',
  link_success:      'Гаманець прив\'язано.\n\n{wallet}',

  wallet_not_linked:   'Гаманець не прив\'язано.\n\nВикористовуйте: /link АДРЕСА_ГАМАНЦЯ',
  vpn_status_header:
    'Статус Plankton VPN\n\n' +
    'Гаманець:\n{wallet}\n\n' +
    '$PLANKTON:\n{balance}\n\n' +
    'Доступ:\n{access}\n\n' +
    'Пристроїв:\n{devices}',
  vpn_access_active:       '✅ Активний',
  vpn_access_inactive:     '❌ Неактивний',
  vpn_access_holder:       '✅ Власник PLANKTON (1M+)',
  vpn_access_subscription: '✅ Активна до {date}',
  vpn_access_both:         '✅ Власник PLANKTON + Активна до {date}',

  no_devices:            'Пристроїв поки немає.',
  device_item:           'Пристрій: {name}\n\nСтатус: {status}\n\nVPN IP: {ip}',
  device_status_active:  'Активний',
  device_status_disabled:'Вимкнений',
  device_disabled:       'Пристрій вимкнено.',
  device_enabled:        'Пристрій увімкнено.',
  device_deleted:        'Пристрій видалено.',

  not_enough_plankton: 'Недостатньо $PLANKTON для безкоштовного доступу.\nОформіть підписку для платного доступу.',
  no_access: 'Доступ закрито.\n\nДля використання VPN потрібно 1 000 000+ $PLANKTON або активна підписка.',
  vpn_creation_failed: 'Помилка створення VPN. Спробуйте ще раз.',
  vpn_ready:           'VPN готовий до використання.\n\nПристрій:\n{name}',

  help_text:
    `*❓ Як отримати безкоштовний VPN?*\n` +
    `Тримайте 1 000 000 $PLANKTON у гаманці\\. Підключіть гаманець у застосунку та натисніть Перевірити доступ\\.\n\n` +
    `*💳 Як оплатити підписку?*\n` +
    `Відкрийте застосунок, перейдіть на вкладку VPN і виберіть тариф\\. Оплата через TON або $PLANKTON\\.\n\n` +
    `*📱 Які пристрої підтримуються?*\n` +
    `Будь\\-який пристрій із WireGuard: iOS, Android, Windows, macOS, Linux\\.\n\n` +
    `*⬇️ Як встановити WireGuard?*\n` +
    `Завантажте офіційний застосунок з wireguard\\.com і імпортуйте \\.conf файл із застосунку\\.\n\n` +
    `*🔧 VPN не працює — що робити?*\n` +
    `Спробуйте завантажити конфіг заново\\. Якщо проблема залишається — зверніться до підтримки нижче\\.`,

  language_choose: 'Оберіть мову:',
  language_set:    '✅ Мову змінено на Українську',
}

export default ua
