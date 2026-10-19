// Minimal ambient typings for the GSAP plugins we use dynamically.
// (gsap ships the plugin runtime, but the @types package does not cover submodules.)
declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: {
    update(): void
    refresh(): void
  }
}

declare module 'gsap/SplitText' {
  export const SplitText: {
    create(
      target: Element | string | null,
      vars?: { type?: string },
    ): { words: Element[]; revert(): void }
  }
}
