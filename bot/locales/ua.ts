import type { LocaleData } from './en'

const ua: LocaleData = {
  welcome:
    `🐋 *Ласкаво просимо до Plankton VPN*\n\n` +
    `Plankton VPN зараз працює у форматі holders\\-only beta\\.\n\n` +
    `Доступ відкритий для власників $PLANKTON\\.\n` +
    `Підтримувані протоколи: WireGuard, Amnezia, OpenVPN\\.\n` +
    `Платні тарифи та реферальна програма скоро\\.\n\n` +
    `Відкрийте Mini App, щоб підключити гаманець і створити VPN\\-конфіги\\.`,

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
    `*Допомога Plankton VPN*\n\n` +
    `*Що таке Plankton VPN?*\n` +
    `Приватний VPN для спільноти $PLANKTON, зараз у форматі holders\\-only beta\\.\n\n` +
    `*Хто може користуватися зараз?*\n` +
    `Власники $PLANKTON з активним холдерським доступом\\.\n\n` +
    `*Як працює холдерський доступ?*\n` +
    `Відкрийте Mini App, підключіть гаманець, перевірте доступ і створіть VPN\\-конфіги\\.\n\n` +
    `*Які протоколи доступні?*\n` +
    `WireGuard, Amnezia і OpenVPN\\.\n\n` +
    `*Який протокол обрати?*\n` +
    `WireGuard: найшвидший\\.\n` +
    `Amnezia: рекомендований для мереж з обмеженнями\\.\n` +
    `OpenVPN: режим сумісності\\.\n\n` +
    `*VPN не підключається?*\n` +
    `Спробуйте Amnezia, потім OpenVPN для суворіших мереж\\.\n\n` +
    `*Інтернет не працює після підключення?*\n` +
    `Відключіться, видаліть профіль, створіть свіжий конфіг та імпортуйте його знову\\.\n\n` +
    `Платні тарифи: скоро\\.\n` +
    `Реферальна програма: скоро\\.\n\n` +
    `Підтримка: https://t\\.me/plankton_support`,

  language_choose: 'Оберіть мову:',
  language_set:    '✅ Мову змінено на Українську',
}

export default ua
