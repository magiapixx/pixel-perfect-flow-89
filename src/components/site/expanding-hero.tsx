import { useEffect, useRef } from 'react'
import { ProjectHero } from './site'

/** Home hero card that grows to fullscreen as the visitor scrolls. */
export function ExpandingHero() {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el?.style.setProperty('--p', '1'); return }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - r.top) / (total + window.innerHeight * 0.35)))
      el.style.setProperty('--p', (1 - Math.pow(1 - p, 2)).toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={track} className="expand-track"><div className="expand-sticky"><ProjectHero/></div></div>
}
