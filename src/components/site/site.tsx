import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight, ArrowUp, Menu, X, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appStore, projects } from './media'

const APPEAR_SELECTORS = '.project-tile, .journal-grid > article, .case-image, .service-detail img, .office-gallery img, .why-photo, .resource-panel'

/** Adds a scroll-appear animation (start 95% → full size) to every card type — replays each time the card re-enters the viewport. Hero cards excluded. */
export function AppearOnScroll() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const targets = Array.from(document.querySelectorAll<HTMLElement>(APPEAR_SELECTORS))
    if (!targets.length) return
    targets.forEach(t => t.classList.add('pre-appear'))
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('appeared')
        else entry.target.classList.remove('appeared')
      })
    }, { threshold: 0.12 })
    targets.forEach(t => io.observe(t))
    return () => io.disconnect()
  }, [pathname])
  return null
}

export function SmoothScroll() {
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let cleanup: (() => void) | undefined
  let cancelled = false
   import('lenis').then(({ default: Lenis }) => {
    if (cancelled) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, duration: 1.15 })
    ;(window as unknown as { __lenis?: unknown }).__lenis = lenis
    cleanup = () => { delete (window as unknown as { __lenis?: unknown }).__lenis; lenis.destroy() }
   })
  return () => { cancelled = true; cleanup?.() }
 }, [])
 return null
}
export function BackToTop() {
 const toTop = () => {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
  if (lenis) lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
 }
 return <button type="button" className="back-to-top" aria-label="Back to top" onClick={toTop}><ArrowUp size={16}/></button>
}
export function Header() {
 const [open,setOpen] = useState(false)
 const {pathname} = useLocation()
 useEffect(() => setOpen(false),[pathname])
 const nav = <><Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link><Link to="/work" className={pathname === '/work' ? 'active' : ''}>Work</Link><Link to="/services" className={pathname === "/services" ? "active" : ""}>Services</Link><Link to="/about" className={pathname === '/about' ? 'active' : ''}>About</Link><Link to="/journal" className={pathname.startsWith('/journal') ? 'active' : ''}>Blog</Link></>
 return <header className="site-header"><Link to="/" className="brand" aria-label="Clay home"><span className="brand-mark">✳</span>clay</Link><nav className="header-nav" aria-label="Main navigation">{nav}</nav><Button asChild className="site-pill desktop-contact"><a href="#contact">LET’S TALK <ArrowUpRight /></a></Button><div className="mobile-nav"><Button variant="ghost" size="icon" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button>{open&&<nav className="mobile-menu" aria-label="Mobile navigation" onClick={()=>setOpen(false)}>{nav}<a href="#contact" onClick={()=>setOpen(false)}>Let’s talk ↗</a></nav>}</div></header>
}
export function Footer() {
 return <footer className="site-footer" id="contact"><div className="footer-main"><div className="footer-contact"><h2>Let’s Talk</h2><a className="footer-email" href="mailto:hey@clay.global">hey@clay.global <ArrowUpRight className="inline h-4 w-4" /></a></div><div className="footer-column"><h3>Navigation</h3><Link to="/work">Work</Link><Link to="/services">Services</Link><Link to="/about">About</Link><Link to="/journal">Blog</Link></div><div className="footer-column"><h3>Company</h3><Link to="/about">About Clay</Link><Link to="/about" hash="office">Our offices</Link><a href="mailto:careers@clay.global">Careers ↗</a><a href="mailto:hey@clay.global">Contact</a></div><div className="footer-column"><h3>Social</h3>{['Instagram','LinkedIn','Dribbble','Behance'].map(s=><a key={s} href={`https://${s.toLowerCase()}.com/${s==='LinkedIn'?'company/':''}clayglobal`} target="_blank" rel="noreferrer">{s} ↗</a>)}</div></div><div className="footer-bottom"><p>© 2026 Clay. All rights reserved.</p><p>Independent minds. Extraordinary outcomes.</p><a href="mailto:hey@clay.global">Get in touch ↗</a></div></footer>
}
export function ProjectHero() { return <Link to="/work/vantara" className="hero-project" aria-label="Explore Say project"><img src={appStore} width={1536} height={864} alt="Sculptural blue App Store icon with a rocket and floating spheres"/><div className="project-caption"><div><h3>Say</h3><p>Bringing a fresh perspective to the world of digital experiences.</p></div><div className="project-tags"><span className="project-tag">Branding</span><span className="project-tag">Digital product</span><span className="arrow-circle"><ArrowUpRight size={14}/></span></div></div></Link> }
export function ProjectGrid({extended=false,bento=false}:{extended?:boolean;bento?:boolean}) { const base=(p:typeof projects[number])=>({...p,style:p.style.replace('wide','').trim()}); const items=extended?[...projects.slice(0,4).map(base),...[0,1,3,2].flatMap((index)=>{const project=projects[index];return project?[base(project)]:[]})]:projects.slice(0,4).map(base); return <div className={`project-grid${bento?' bento-grid':''}`}>{items.map((p,i)=><Link key={`${p.name}-${i}`} to="/work/vantara" className={`project-tile ${p.style}${bento?` b${i+1}`:''}`} aria-label={`View ${p.name} project`}><img src={p.image} alt={`${p.name} digital design project`} width={1536} height={864} loading="lazy"/><div className="project-caption"><div><h3>{p.name}</h3><p>{p.description}</p></div><div className="project-tags">{p.tags.map(t=><span className="project-tag" key={t}>{t}</span>)}<span className="arrow-circle"><ArrowUpRight size={14}/></span></div></div></Link>)}</div> }
const faqs = [
 ['What sets your creative agency apart from others?','We bring strategy, design, and engineering together in one collaborative team. Every project is led by our co-founders, with a focus on creating work that is both distinctive and useful.'],
 ['Do you work with startups or only established companies?','Both. We partner with ambitious startups and established global brands, shaping each engagement around the team, the opportunity, and the goals.'],
 ['Do you provide both design and development services?','Yes. Our teams work across brand strategy, digital product design, websites, content, and development — from the first idea to the final experience.'],
 ['How long does a typical project take?','Timing depends on scope and complexity. After our first conversation, we put together a clear plan with milestones tailored to your project.'],
 ['Can you work with our existing team and brand?','Absolutely. We work closely with in-house teams and can build on your existing brand or help you explore an entirely new direction.'],
 ['How do we get started on a project together?','Send a note to hey@clay.global with a little about your company and what you have in mind. We’ll start with a conversation.'],
]
export function FAQ() { const [active,setActive]=useState<number|null>(null); return <section className="faq"><p className="eyebrow">A little more clarity</p><h2>Frequently Asked Questions</h2>{faqs.map(([q,a],i)=><div key={q} className="faq-row"><Button variant="ghost" className="faq-trigger" aria-expanded={active===i} aria-controls={`faq-${i}`} onClick={()=>setActive(active===i?null:i)}>{q}{active===i?<Minus size={14}/>:<Plus size={14}/>}</Button>{active===i&&<p id={`faq-${i}`} className="faq-answer">{a}</p>}</div>)}</section> }
export function ContactBand() { return <section className="contact-band"><h3>A Platform that Inspires</h3><p>We turn ambitious ideas into meaningful digital experiences that move your brand — and the world — forward.</p><div className="contact-actions"><Button asChild className="site-pill"><a href="mailto:hey@clay.global">START A PROJECT <ArrowUpRight/></a></Button></div></section> }
export function Breadcrumb({current}:{current:string}) { return <p className="breadcrumb"><span>CLAY GLOBAL</span> / &nbsp; {current.toUpperCase()}</p> }
export function pageHead(title:string,description:string) { return {meta:[{title:`${title} — Clay`},{name:'description',content:description},{property:'og:title',content:`${title} — Clay`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]} }
