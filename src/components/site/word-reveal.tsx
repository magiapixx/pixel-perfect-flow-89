import { useEffect } from 'react'

type LenisLike = {
  on?: (event: string, cb: () => void) => void
  off?: (event: string, cb: () => void) => void
}

type CleanupFn = () => void

/** Types: gsap comes typed via @types/gsap; plugins come from our ambient d.ts. */
type GsapModule = typeof import('gsap')['gsap']

/**
 * WordScrollReveal — words of `selector` light up progressively while the
 * block scrolls through the center of the viewport (scrubbed by scroll).
 * Animates opacity only, so it reads correctly on light and dark sections.
 */
export function WordScrollReveal({
  selector,
  start = 0.02,
}: {
  selector: string
  /** Starting opacity of each word (fully lit = 1). */
  start?: number
}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false
    let cleanup: CleanupFn | undefined

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      document.fonts.ready,
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger, SplitText)
      const target = document.querySelector<HTMLElement>(selector)
      if (!target) return

      // Keep ScrollTrigger in sync with Lenis smooth scrolling.
      const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
      if (lenis?.on) lenis.on('scroll', ScrollTrigger.update)

      const split = SplitText.create(target, { type: 'words' })
      const tween = gsap.fromTo(
        split.words,
        { opacity: start },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: target,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        },
      )

      cleanup = () => {
        if (lenis?.off) lenis.off('scroll', ScrollTrigger.update)
        const st = (tween as unknown as { scrollTrigger?: { kill(): void } }).scrollTrigger
        if (st) st.kill()
        tween.kill()
        split.revert()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [selector, start])

  return null
}
