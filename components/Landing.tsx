import { getDict } from '@/lib/i18n';
export default function Landing({locale}:{locale:string}){
 const t = getDict(locale); const switchLocale = locale === 'ru' ? '/en' : '/ru';
 return <>
  <div className="container"><nav className="nav"><div className="brand">PLANKTON VPN</div><div className="navlinks"><a href="#how">{t.navHow}</a><a href="#access">{t.navAccess}</a><a href="#bot">{t.navBot}</a><a href={`/${locale}/admin`}>{t.navAdmin}</a><a href={switchLocale}>{locale==='ru'?'EN':'RU'}</a></div></nav>
  <section className="hero"><div className="badge">{t.heroBadge}</div><h1><span className="blue">{t.title1}</span><br/>{t.title2}</h1><p className="lead">{t.lead}</p><div className="actions"><a className="btn btnMain" href={`/${locale}/dashboard`}>{t.connect}</a><a className="btn" href="https://t.me/PlanktonVPNBot" target="_blank">{t.openBot}</a></div></section></div>
  <div className="ticker"><div className="track">{[...t.ticker,...t.ticker].map((x,i)=><span key={i}>{x}</span>)}</div></div>
  <div className="container"><section id="how" className="section"><h2 className="title">{t.howTitle}</h2><div className="grid3">{t.steps.map((s,i)=><div className="card" key={i}><div className="num">{i+1}</div><h3>{s[0]}</h3><p>{s[1]}</p></div>)}</div></section>
  <section id="access" className="section"><h2 className="title">{t.accessTitle}</h2><div className="grid3">{t.access.map((s,i)=><div className="card" key={i}><h3>{s[0]}</h3><p>{s[1]}</p></div>)}</div></section>
  <section id="bot" className="section"><h2 className="title">{t.botTitle}</h2><div className="panel">{t.bot.map((x,i)=><p key={i}><span className="status">{i+1}</span> &nbsp; {x}</p>)}</div></section>
  <section className="section"><h2 className="title">{t.securityTitle}</h2><div className="grid3">{t.security.map((s,i)=><div className="card" key={i}><h3>{s[0]}</h3><p>{s[1]}</p></div>)}</div></section></div>
  <footer className="footer">{t.footer}<br/>plankton.ceo · @CEO_Plankton · @ceo_plankton</footer>
 </>
}
