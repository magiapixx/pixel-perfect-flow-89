<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep TanStack Start file-based routing with shared chrome in the root route; the platform does not support Astro.
- Keep reusable agency UI and browser-safe project data in `src/components/site`; this keeps page layouts consistent.
- Initialize Lenis through a client-effect dynamic import and honor reduced-motion preferences; SSR must not touch browser APIs.
- Define all visual tokens and responsive layout styles in the global Tailwind v4 stylesheet; pages consume semantic styles.
- Keep journal content in a browser-safe typed article collection with an index layout and slug-based detail routes; cards and full stories share one source of truth.
