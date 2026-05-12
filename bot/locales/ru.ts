import type { LocaleData } from './en'

const ru: LocaleData = {
  welcome:
    `🐋 *Добро пожаловать в Plankton VPN*\n\n` +
    `Приватный VPN\\-доступ для держателей $PLANKTON\\.\n\n` +
    `⚡ Быстрые WireGuard\\-серверы\n` +
    `🔐 Оплата через TON или $PLANKTON\n` +
    `🌍 Работает в любой стране\n` +
    `🎁 Бесплатно для держателей 1M\\+ $PLANKTON\n\n` +
    `Нажмите *Launch App* чтобы начать\\.`,

  btn_launch_app:       'Launch App',
  btn_my_vpn:           'Мой VPN',
  btn_devices:          'Устройства',
  btn_subscription:     'Подписка',
  btn_help:             'Помощь',
  btn_language:         '🌐 Язык',
  btn_contact_support:  'Написать в поддержку',
  btn_download_config:  'Скачать конфиг',
  btn_disable:          'Отключить',
  btn_enable:           'Включить',
  btn_delete:           'Удалить',

  link_usage:        'Использование: /link АДРЕС_КОШЕЛЬКА',
  link_already_taken:'Этот кошелёк уже привязан к другому Telegram-аккаунту.',
  link_success:      'Кошелёк привязан.\n\n{wallet}',

  wallet_not_linked:   'Кошелёк не привязан.\n\nИспользуйте: /link АДРЕС_КОШЕЛЬКА',
  vpn_status_header:
    'Статус Plankton VPN\n\n' +
    'Кошелёк:\n{wallet}\n\n' +
    '$PLANKTON:\n{balance}\n\n' +
    'Доступ:\n{access}\n\n' +
    'Устройств:\n{devices}',
  vpn_access_active:   '✅ Активен',
  vpn_access_inactive: '❌ Неактивен',

  no_devices:            'Устройств пока нет.',
  device_item:           'Устройство: {name}\n\nСтатус: {status}\n\nVPN IP: {ip}',
  device_status_active:  'Активно',
  device_status_disabled:'Отключено',
  device_disabled:       'Устройство отключено.',
  device_enabled:        'Устройство включено.',
  device_deleted:        'Устройство удалено.',

  not_enough_plankton: 'Недостаточно $PLANKTON для бесплатного доступа.\nОформите подписку для платного доступа.',
  vpn_creation_failed: 'Ошибка создания VPN. Попробуйте ещё раз.',
  vpn_ready:           'VPN готов к использованию.\n\nУстройство:\n{name}',

  help_text:
    `*❓ Как получить бесплатный VPN?*\n` +
    `Держите 1 000 000 $PLANKTON в кошельке\\. Подключите кошелёк в приложении и нажмите Проверить доступ\\.\n\n` +
    `*💳 Как оплатить подписку?*\n` +
    `Откройте приложение, перейдите на вкладку VPN и выберите тариф\\. Оплата через TON или $PLANKTON\\.\n\n` +
    `*📱 Какие устройства поддерживаются?*\n` +
    `Любое устройство с WireGuard: iOS, Android, Windows, macOS, Linux\\.\n\n` +
    `*⬇️ Как установить WireGuard?*\n` +
    `Скачайте официальное приложение с wireguard\\.com и импортируйте \\.conf файл из приложения\\.\n\n` +
    `*🔧 VPN не работает — что делать?*\n` +
    `Попробуйте скачать конфиг заново\\. Если проблема не исчезла — напишите в поддержку ниже\\.`,

  language_choose: 'Выберите язык:',
  language_set:    '✅ Язык изменён на Русский',
}

export default ru
