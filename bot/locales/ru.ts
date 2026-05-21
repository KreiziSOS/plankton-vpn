import type { LocaleData } from './en'

const ru: LocaleData = {
  welcome:
    `🐋 *Добро пожаловать в Plankton VPN*\n\n` +
    `Plankton VPN сейчас работает в формате holders\\-only beta\\.\n\n` +
    `Доступ открыт для держателей $PLANKTON\\.\n` +
    `Поддерживаемые протоколы: WireGuard, Amnezia, OpenVPN\\.\n` +
    `Платные тарифы и реферальная программа скоро\\.\n\n` +
    `Откройте Mini App, чтобы подключить кошелёк и создать VPN\\-конфиги\\.`,

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
  vpn_access_active:       '✅ Активен',
  vpn_access_inactive:     '❌ Неактивен',
  vpn_access_holder:       '✅ Держатель PLANKTON (1M+)',
  vpn_access_subscription: '✅ Активна до {date}',
  vpn_access_both:         '✅ Держатель PLANKTON + Активна до {date}',

  no_devices:            'Устройств пока нет.',
  device_item:           'Устройство: {name}\n\nСтатус: {status}\n\nVPN IP: {ip}',
  device_status_active:  'Активно',
  device_status_disabled:'Отключено',
  device_disabled:       'Устройство отключено.',
  device_enabled:        'Устройство включено.',
  device_deleted:        'Устройство удалено.',

  not_enough_plankton: 'Недостаточно $PLANKTON для бесплатного доступа.\nОформите подписку для платного доступа.',
  no_access: 'Доступ закрыт.\n\nДля использования VPN необходимо 1 000 000+ $PLANKTON или активная подписка.',
  vpn_creation_failed: 'Ошибка создания VPN. Попробуйте ещё раз.',
  vpn_ready:           'VPN готов к использованию.\n\nУстройство:\n{name}',

  help_text:
    `*Помощь Plankton VPN*\n\n` +
    `*Что такое Plankton VPN?*\n` +
    `Приватный VPN для сообщества $PLANKTON, сейчас в формате holders\\-only beta\\.\n\n` +
    `*Кто может пользоваться сейчас?*\n` +
    `Держатели $PLANKTON с активным холдерским доступом\\.\n\n` +
    `*Как работает холдерский доступ?*\n` +
    `Откройте Mini App, подключите кошелёк, проверьте доступ и создайте VPN\\-конфиги\\.\n\n` +
    `*Какие протоколы доступны?*\n` +
    `WireGuard, Amnezia и OpenVPN\\.\n\n` +
    `*Какой протокол выбрать?*\n` +
    `WireGuard: самый быстрый\\.\n` +
    `Amnezia: рекомендуется для сетей с ограничениями\\.\n` +
    `OpenVPN: режим совместимости\\.\n\n` +
    `*VPN не подключается?*\n` +
    `Попробуйте Amnezia, затем OpenVPN для более строгих сетей\\.\n\n` +
    `*Интернет не работает после подключения?*\n` +
    `Отключитесь, удалите профиль, создайте свежий конфиг и импортируйте его заново\\.\n\n` +
    `Платные тарифы: скоро\\.\n` +
    `Реферальная программа: скоро\\.\n\n` +
    `Поддержка: https://t\\.me/plankton_support`,

  language_choose: 'Выберите язык:',
  language_set:    '✅ Язык изменён на Русский',
}

export default ru
