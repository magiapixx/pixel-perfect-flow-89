import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

const BAND_SELECTOR = '.invert-band'

type Band = {
  members: HTMLElement[]
  enter?: HTMLElement
  exit?: HTMLElement
  dark: boolean
}

/**
 * Reusable "dark band" behaviour — sections that turn dark while they cross the
 * page and back to light once they are gone. Works on any route.
 *
 * Markup
 * ------
 *   <section className="invert-band" data-invert-group="about" data-invert-enter>…</section>
 *   <section className="invert-band" data-invert-group="about" data-invert-exit>…</section>
 *
 * - Every section of a group carries the same `data-invert-group` value; all of
 *   them flip together, so adjacent sections read as one continuous band.
 * - ON  — the `data-invert-enter` section reaches the middle of the viewport.
 * - OFF — only after the last content block of the `data-invert-exit` section
 *   has left the viewport (the section's own bottom padding is ignored).
 * - No markers? The first section of the group becomes the trigger, the last
 *   one becomes the exit.
 *
 * Optional modifiers
 * ------------------
 *   data-invert-trigger="edge"  start as soon as the section touches the viewport
 *   data-invert-exit="box"      measure the whole section box (padding included)
 *   data-invert-exit=".a, .b"   CSS selector(s) for the content that ends the band;
 *                               the lowest match wins (useful when the last block
 *                               sits deep inside a wrapper)
 *
 * Colours live in styles.css (`.invert-band` / `.is-dark`): they are remapped
 * through local CSS variables, so child components that use --foreground,
 * --muted-foreground, --border, --blue, --primary or --secondary adapt on their
 * own — no per-page overrides needed.
 */
export function InvertOnScroll() {
  const { pathname } = useLocation()
  useEffect(() => {
    const bands = new Map<string, Band>()
    document.querySelectorAll<HTMLElement>(BAND_SELECTOR).forEach((el, i) => {
      const key = el.dataset['invertGroup'] ?? `#${i}`
      const band = bands.get(key) ?? { members: [], dark: false }
      band.members.push(el)
      if (el.dataset['invertEnter'] !== undefined) band.enter = el
      if (el.dataset['invertExit'] !== undefined) band.exit = el
      bands.set(key, band)
    })
    if (!bands.size) return

    /** Bottom edge of whatever ends the dark band: a selector, the box, or the last child. */
    const exitBottom = (exit: HTMLElement) => {
      const flag = (exit.dataset['invertExit'] ?? '').trim()
      if (flag === 'box') return exit.getBoundingClientRect().bottom
      const targets = flag && flag !== 'true' ? Array.from(exit.querySelectorAll<HTMLElement>(flag)) : []
      const nodes = targets.length ? targets : [exit.lastElementChild ?? exit]
      return Math.max(...nodes.map(n => n.getBoundingClientRect().bottom))
    }

    const update = () => {
      const vh = window.innerHeight
      bands.forEach((band) => {
        const { members } = band
        const enter = band.enter ?? members[0]
        const exit = band.exit ?? members[members.length - 1]
        if (!enter || !exit) return
        const trigger = enter.dataset['invertTrigger'] === 'edge' ? vh : vh / 2
        const dark = enter.getBoundingClientRect().top < trigger && exitBottom(exit) > 0
        if (dark === band.dark) return
        band.dark = dark
        members.forEach(m => m.classList.toggle('is-dark', dark))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])
  return null
}
