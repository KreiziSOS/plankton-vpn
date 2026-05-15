import 'dotenv/config'
import { Bot, InlineKeyboard, InputFile } from 'grammy'
import { prisma } from '../lib/prisma'
import { checkUserAccess } from '../lib/access'
import { getUserLanguage } from './helpers/getUserLanguage'
import { loc } from './helpers/loc'

// ─── Placeholders — replace before going live ────────────────────────────────
const SUPPORT_USERNAME = '@plankton_support'
const CHANNEL_USERNAME = '@plankton_official'
const WEBSITE_URL = process.env.APP_URL || 'https://plankton-vpn-mvp.vercel.app'

// ─── Init ────────────────────────────────────────────────────────────────────
const token  = process.env.TELEGRAM_BOT_TOKEN
const appUrl = process.env.APP_URL

if (!token)  throw new Error('TELEGRAM_BOT_TOKEN missing')
if (!appUrl) throw new Error('APP_URL missing')

const bot = new Bot(token)

// ─── Shared helpers ──────────────────────────────────────────────────────────
async function getUserByTelegramId(telegramId: string) {
  return prisma.user.findUnique({
    where: { telegramId },
    include: { devices: true },
  })
}

function mainMenu(lang: string) {
  return new InlineKeyboard()
    .webApp(loc(lang, 'btn_launch_app'), `${appUrl}/en/app`)
    .row()
    .text(loc(lang, 'btn_my_vpn'),    'myvpn')
    .text(loc(lang, 'btn_devices'),   'devices')
    .row()
    .webApp(loc(lang, 'btn_subscription'), `${appUrl}/en/app?startapp=plans`)
    .text(loc(lang, 'btn_help'),      'help')
    .row()
    .text(loc(lang, 'btn_language'),  'language')
}

// ─── /start ──────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  const lang = await getUserLanguage(ctx)

  await ctx.replyWithPhoto(
    new InputFile('./bot/assets/welcome.png'),
    {
      caption:    loc(lang, 'welcome'),
      parse_mode: 'MarkdownV2',
      reply_markup: mainMenu(lang),
    }
  )
})

// ─── My VPN ──────────────────────────────────────────────────────────────────
bot.callbackQuery('myvpn', async (ctx) => {
  const lang = await getUserLanguage(ctx)
  const user = await getUserByTelegramId(String(ctx.from.id))

  await ctx.answerCallbackQuery()

  if (!user) {
    await ctx.reply(loc(lang, 'wallet_not_linked'))
    return
  }

  const access = await checkUserAccess(user.wallet)

  const balance = 'balance' in access.plankton
    ? String(access.plankton.balance)
    : '?'

  let accessLine: string
  if (access.source === 'none') {
    accessLine = loc(lang, 'vpn_access_inactive')
  } else if (access.source === 'holder') {
    accessLine = loc(lang, 'vpn_access_holder')
  } else if (access.source === 'subscription') {
    const d = new Date(access.subscription!.expiresAt).toLocaleDateString()
    accessLine = loc(lang, 'vpn_access_subscription').replace('{date}', d)
  } else {
    // 'both'
    const d = new Date(access.subscription!.expiresAt).toLocaleDateString()
    accessLine = loc(lang, 'vpn_access_both').replace('{date}', d)
  }

  await ctx.reply(
    loc(lang, 'vpn_status_header')
      .replace('{wallet}',  user.wallet)
      .replace('{balance}', balance)
      .replace('{devices}', String(user.devices.length))
      .replace('{access}',  accessLine),
    { reply_markup: mainMenu(lang) }
  )
})

// ─── Devices ─────────────────────────────────────────────────────────────────
bot.callbackQuery('devices', async (ctx) => {
  const lang = await getUserLanguage(ctx)
  const user = await getUserByTelegramId(String(ctx.from.id))

  await ctx.answerCallbackQuery()

  if (!user) {
    await ctx.reply(loc(lang, 'wallet_not_linked'))
    return
  }

  if (user.devices.length === 0) {
    await ctx.reply(loc(lang, 'no_devices'))
    return
  }

  for (const device of user.devices) {
    const kb = new InlineKeyboard()
      .url(
        loc(lang, 'btn_download_config'),
        `${appUrl}/api/vpn/download?name=${device.name}`
      )
      .row()
      .text(
        device.enabled ? loc(lang, 'btn_disable') : loc(lang, 'btn_enable'),
        `${device.enabled ? 'disable' : 'enable'}:${device.id}`
      )
      .text(loc(lang, 'btn_delete'), `delete:${device.id}`)

    await ctx.reply(
      loc(lang, 'device_item')
        .replace('{name}',   device.name)
        .replace('{status}', device.enabled
          ? loc(lang, 'device_status_active')
          : loc(lang, 'device_status_disabled'))
        .replace('{ip}', device.address || '-'),
      { reply_markup: kb }
    )
  }
})

// ─── Create VPN ──────────────────────────────────────────────────────────────
bot.callbackQuery('createvpn', async (ctx) => {
  const lang = await getUserLanguage(ctx)
  const user = await getUserByTelegramId(String(ctx.from.id))

  await ctx.answerCallbackQuery()

  if (!user) {
    await ctx.reply(loc(lang, 'wallet_not_linked'))
    return
  }

  const access = await checkUserAccess(user.wallet)

  if (!access.hasAccess) {
    await ctx.reply(loc(lang, 'no_access'))
    return
  }

  const createRes = await fetch(`${appUrl}/api/vpn/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet: user.wallet }),
  })
  const created = await createRes.json()

  if (!created.ok) {
    await ctx.reply(loc(lang, 'vpn_creation_failed'))
    return
  }

  const deviceName = created.device?.name

  await ctx.reply(
    loc(lang, 'vpn_ready').replace('{name}', deviceName),
    {
      reply_markup: new InlineKeyboard()
        .url(loc(lang, 'btn_download_config'), `${appUrl}/api/vpn/download?name=${deviceName}`)
        .row()
        .webApp(loc(lang, 'btn_launch_app'), `${appUrl}/en/app`),
    }
  )
})

// ─── Help / FAQ ───────────────────────────────────────────────────────────────
bot.callbackQuery('help', async (ctx) => {
  const lang = await getUserLanguage(ctx)

  await ctx.answerCallbackQuery()
  await ctx.reply(
    loc(lang, 'help_text'),
    {
      parse_mode: 'MarkdownV2',
      reply_markup: new InlineKeyboard()
        .url(
          loc(lang, 'btn_contact_support'),
          `https://t.me/${SUPPORT_USERNAME.slice(1)}`
        )
        .row()
        .url(CHANNEL_USERNAME, `https://t.me/${CHANNEL_USERNAME.slice(1)}`)
        .row()
        .url('🌐 Website', WEBSITE_URL),
    }
  )
})

// ─── Language picker ─────────────────────────────────────────────────────────
bot.callbackQuery('language', async (ctx) => {
  const lang = await getUserLanguage(ctx)

  await ctx.answerCallbackQuery()
  await ctx.reply(
    loc(lang, 'language_choose'),
    {
      reply_markup: new InlineKeyboard()
        .text('🇺🇸 English',    'set_lang:en')
        .text('🇷🇺 Русский',    'set_lang:ru')
        .row()
        .text('🇺🇦 Українська', 'set_lang:ua')
        .text('🇨🇳 中文',       'set_lang:zh'),
    }
  )
})

bot.callbackQuery(/^set_lang:(.+)/, async (ctx) => {
  const newLang    = ctx.match[1]
  const telegramId = String(ctx.from.id)

  // Save preference — silent no-op if user hasn't linked a wallet yet
  await prisma.user.updateMany({
    where: { telegramId },
    data:  { language: newLang },
  })

  await ctx.answerCallbackQuery(loc(newLang, 'language_set'))

  await ctx.replyWithPhoto(
    new InputFile('./bot/assets/welcome.png'),
    {
      caption:    loc(newLang, 'welcome'),
      parse_mode: 'MarkdownV2',
      reply_markup: mainMenu(newLang),
    }
  )
})

// ─── /link ───────────────────────────────────────────────────────────────────
bot.command('link', async (ctx) => {
  const lang       = await getUserLanguage(ctx)
  const telegramId = String(ctx.from?.id)
  const wallet     = ctx.message?.text?.split(' ')[1]

  if (!wallet) {
    await ctx.reply(loc(lang, 'link_usage'))
    return
  }

  const existing = await prisma.user.findUnique({ where: { wallet } })

  if (existing?.telegramId && existing.telegramId !== telegramId) {
    await ctx.reply(loc(lang, 'link_already_taken'))
    return
  }

  await prisma.user.upsert({
    where:  { wallet },
    update: { telegramId },
    create: { wallet, telegramId },
  })

  await ctx.reply(
    loc(lang, 'link_success').replace('{wallet}', wallet),
    { reply_markup: mainMenu(lang) }
  )
})

// ─── Device actions ───────────────────────────────────────────────────────────
bot.callbackQuery(/^disable:(.+)/, async (ctx) => {
  const lang = await getUserLanguage(ctx)
  await fetch(`${appUrl}/api/vpn/device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: ctx.match[1], action: 'disable' }),
  })
  await ctx.answerCallbackQuery()
  await ctx.reply(loc(lang, 'device_disabled'), { reply_markup: mainMenu(lang) })
})

bot.callbackQuery(/^enable:(.+)/, async (ctx) => {
  const lang = await getUserLanguage(ctx)
  await fetch(`${appUrl}/api/vpn/device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: ctx.match[1], action: 'enable' }),
  })
  await ctx.answerCallbackQuery()
  await ctx.reply(loc(lang, 'device_enabled'), { reply_markup: mainMenu(lang) })
})

bot.callbackQuery(/^delete:(.+)/, async (ctx) => {
  const lang = await getUserLanguage(ctx)
  await fetch(`${appUrl}/api/vpn/device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: ctx.match[1], action: 'delete' }),
  })
  await ctx.answerCallbackQuery()
  await ctx.reply(loc(lang, 'device_deleted'), { reply_markup: mainMenu(lang) })
})

// ─── Error handler ────────────────────────────────────────────────────────────
bot.catch((err) => {
  console.error(err)
})

bot.start()
console.log('Plankton VPN bot started')
