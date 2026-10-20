import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects, laptop } from './media'

/**
 * Selected work mosaic — cards alternate from the right edge to the left edge
 * (top-right → bottom-left → bottom-right → …) while the mobile-app projects
 * are rendered 25% smaller than the websites, so the composition stays
 * deliberately off-balance.
 *
 * Order below: web, app, web, web, app, web (4 websites + 2 mobile apps).
 */
const MOSAIC = [1, 0, 2, 4, 3, 5]

type CleanupFn = () => void
type LenisLike = {
  on?: (event: string, cb: () => void) => void
  off?: (event: string, cb: () => void) => void
}

export function SelectedWork() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    let cleanup: CleanupFn | undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), document.fonts.ready]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const cards = gsap.utils.toArray<HTMLElement>('.work-mosaic .work-card')
      if (!cards.length) return

      // Keep ScrollTrigger in sync with Lenis smooth scrolling.
      const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
      if (lenis?.on) lenis.on('scroll', ScrollTrigger.update)

      // Each card grows 10% as it travels into the viewport (scrubbed).
      const tweens = cards.map((card) =>
        gsap.fromTo(
          card,
          { scale: 1 },
          {
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 40%',
              scrub: true,
            },
          },
        ),
      )

      cleanup = () => {
        if (lenis?.off) lenis.off('scroll', ScrollTrigger.update)
        tweens.forEach((tween) => {
          const st = (tween as unknown as { scrollTrigger?: { kill(): void } }).scrollTrigger
          if (st) st.kill()
          tween.kill()
        })
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div className="work-mosaic">
      {MOSAIC.map((index, i) => {
        const project = projects[index]
        if (!project) return null
        const side = i % 2 === 0 ? 'is-right' : 'is-left'
        const size = project.kind === 'app' ? ' is-app' : ''
        // The laptop shot is a pale scene: its lower third needs dark type.
        const tone = project.image === laptop ? ' is-light' : ''
        return (
          <Link
            key={`${project.name}-${i}`}
            to="/work/vantara"
            className={`work-card ${side}${size}${tone}`}
            aria-label={`View ${project.name} project`}
          >
            <img
              src={project.image}
              alt={`${project.name} project`}
              width={1536}
              height={864}
              loading="lazy"
              style={project.focus ? { objectPosition: project.focus } : undefined}
            />
            <div className="project-caption">
              <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
                <span className="arrow-circle"><ArrowUpRight size={14} /></span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
