# CLAUDE.md — astro-aws-portfolio

Context file for Claude Code. Read this before touching any file.

---

## Project

Personal developer portfolio for **s3bc40 / Sébastien Claro**.
Live at `https://www.s3bc40.com`.

---

## Stack

| Layer       | Choice |
|-------------|--------|
| Framework   | Astro 6, `output: static` |
| Fonts       | Inter (400, 500) + JetBrains Mono (400, 500) via Google Fonts `@import` |
| CSS         | Vanilla — no framework, no utility classes |
| TypeScript  | Strict mode (`astro/tsconfigs/strict`) |
| Deployment  | AWS S3 (eu-west-3) + CloudFront |
| CI/CD       | GitHub Actions — OIDC auth, Node 22 |
| DNS         | Vercel DNS → CloudFront CNAME |
| Sitemap     | `@astrojs/sitemap` — auto-generated at build |

**Never introduce a UI framework (React, Vue, Svelte) or a CSS framework (Tailwind, etc.) into this portfolio's codebase.** These may appear in the Stack section as technologies used in other projects — that's fine.

---

## Design system

All tokens live in `src/layouts/Base.astro` inside `:root`. Do not hardcode colors or fonts anywhere else.

```css
--bg:         #0f1117   /* page background */
--surface:    #16181d   /* cards, terminal body, code blocks */
--border:     #3f3f46   /* all borders */
--accent:     #f59e0b   /* amber — primary highlight */
--accent-dim: #92400e   /* amber dim — build notes, secondary highlights */
--text:       #e4e4e7   /* body text */
--muted:      #71717a   /* secondary text, labels */
--font-sans:  'Inter', system-ui, sans-serif
--font-mono:  'JetBrains Mono', monospace
```

**Theme direction:** Ayu Dark inspired. Terminal aesthetic throughout.

### Breakpoints (mobile-first)
- `480px` — hamburger nav, stacked CTAs, simplified grids
- `768px` — (available, currently unused)
- `1024px` — (available, currently unused)

### Max-width containers
- `.container-text` — `680px`, centered, `padding-inline: 1.25rem`
- `.container-projects` — `860px`, centered, `padding-inline: 1.25rem`

### Section label pattern
```html
<p class="section-label">// section-name</p>
```
Defined globally in `Base.astro`. Mono, 0.8rem, amber, uppercase, letter-spacing. Has `::after` line extending right. Scroll-reveal via IntersectionObserver (slides in from left on viewport entry).

### Section separator
Every section except Hero uses `border-top: 1px solid var(--border)`.

### Padding rhythm
- Desktop: `padding-block: 4.5rem`
- Mobile: `padding-block: 3.5rem`

---

## File structure

```
src/
├── layouts/
│   └── Base.astro          — global tokens, reset, fonts, OG meta, scanlines, scroll reveal
├── components/
│   ├── Nav.astro            — sticky nav, scroll border, hamburger <480px
│   ├── Hero.astro           — terminal window, boot sequence, typewriter, glitch
│   ├── About.astro          — two paragraphs + at-a-glance grid
│   ├── Stack.astro          — tech rows by category with chip tags
│   ├── Projects.astro       — vertical card stack
│   ├── Architecture.astro   — ASCII pipeline diagram with highlight injection
│   └── Contact.astro        — availability dot, link list, footer
└── pages/
    ├── index.astro          — assembles all components
    └── 404.astro            — terminal-themed error page

public/
├── og.png                   — 1200×630 social card (programmatic placeholder, replace with designed asset)
└── robots.txt               — allow all, points to sitemap-index.xml
```

**Section order in `index.astro`:**
Hero → About → Stack → Projects → Architecture → Contact

---

## Sections

### Nav
- Sticky, `z-index: 100`, scroll border after 10px
- Left: `s3bc40` in mono amber
- Right: `GitHub ↗` + `s3bc40@gmail.com` mailto link
- Mobile (<480px): hamburger replaces right links, slide-down menu with `hidden` attribute toggled by JS

### Hero
- Full terminal window: macOS chrome (traffic light dots `#ff5f57 / #febc2e / #28c840`), title `s3bc40@portfolio: ~`
- Boot sequence types itself line by line (`> boot portfolio.js`, `✓ modules loaded`, `✓ status: available`, `✓ ready — launching...`), then clears
- Main content hidden (`visibility: hidden`) during boot, revealed after via `animation-play-state: running`
- Staggered `fadeUp` animations: prompt (0ms) → name (150ms) → tagline (300ms) → subline (500ms) → CTAs (650ms)
- Typewriter: 38ms/char, blinking `█` cursor, freezes on completion
- `h1` periodic glitch: `name-glitch` keyframe every 9s — RGB shift + brightness burst. **Known issue:** glitch class overrides `fadeUp forwards` fill → fixed with explicit `opacity: 1` on `.hero-name.glitch`
- Amber dot-grid background + radial glow behind terminal
- CRT scanlines: `body::before` in `Base.astro`, fixed overlay, ~2% opacity
- `↓` scroll cue fades in last, bounces

### About
- Two paragraphs: experience + workflow philosophy
- At-a-glance `<dl>` grid: Available / Location / Languages / Setup / Mail
- Two-column on desktop, single-column on mobile (dt turns amber)

### Stack
- Six rows: Languages · Frontend · Backend · Cloud · AI · Tooling
- Chips: `--surface` bg, `--border` border, hover → amber border + text
- Grid layout: `100px` label column + `1fr` chips column

### Projects
- Data-driven: array of project objects in frontmatter
- Each card: terminal path (`~/projects/name`) + name `[lang]` + description + optional build note + links + optional inline command
- Left `3px` border in `--accent-dim` at rest, full border + left → `--accent` on hover
- Box-shadow lifts cards, tints amber on hover
- Coming soon card: `opacity: 0.4`, no hover
- **Current projects:** devbrief [Python], devisio.dev [TypeScript], txdecode [Rust], [Next project] (coming soon)

### Architecture
- ASCII pipeline diagram: GitHub → Actions → S3 → CloudFront → s3bc40.com
- Diagram is a plain template literal in frontmatter — **do not use HTML entities**
- Highlights injected programmatically: `highlight(diagram, terms)` escapes HTML then wraps terms in `<span class="hl">`
- Terms highlighted in amber: `git push`, `OIDC → AWS STS`, `OAC`, `HTTPS TLS 1.3`, `s3bc40.com`
- `.arch-block :global(.hl)` needed because `set:html` bypasses Astro scoping

### Contact
- Pulsing green dot (`#4ade80`) + "Available for missions" status
- Four links: `s3bc40@gmail.com` / `github.com/s3bc40` / `linkedin.com/in/sgoncalvesclaro` / `malt.fr/profile/sebastiengoncalvesclaro`
- Link rows with `border-bottom` separators, amber `→` prefix, bottom border turns amber on hover
- Footer: `s3bc40 · built with Astro · deployed on AWS`

### 404
- Uses `Base` layout, `in-view` class on section-label (no scroll needed)
- Large muted mono heading, terminal prompt line, amber bordered CTA → `/`

---

## GitHub Actions (`deploy.yml`)

- Trigger: push to `main`
- Node: 22
- Auth: **OIDC only** — no static credentials stored. `aws-actions/configure-aws-credentials@v4` assumes role via `secrets.AWS_ROLE_ARN`
- S3 sync: `--delete`, region `eu-west-3`
- CloudFront invalidation: `/*` (accepted tradeoff — not best practice but intentional)

**Required secrets:** `AWS_ROLE_ARN`, `AWS_S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`

---

## AWS architecture notes

- S3 bucket: **fully private**, no public access policy
- CloudFront accesses S3 via **OAC** (Origin Access Control) — never direct S3 URL
- ACM certificate: **must be in `us-east-1`** regardless of bucket region
- S3 bucket region: `eu-west-3` (Paris)
- CloudFront custom error: map 403 + 404 → `/index.html` with 200 response (handles direct URL access)
- `trailingSlash: 'never'` in `astro.config.mjs` keeps paths clean for CloudFront resolution

---

## Agent behaviour

### Tone and process
- English only — even if the user writes in French
- Concise responses — no summaries after edits, no filler
- Build section by section, show result after each change
- Always run `npm run build` after any component or config change to verify

### Code rules
- No inline styles — all styling via scoped `<style>` or global tokens
- No hardcoded colors or font names outside `Base.astro :root`
- No lorem ipsum — all content is real
- Semantic HTML: `nav`, `main`, `section`, `footer`, `article`, `header`
- Astro scoping quirk: `set:html` content needs `:global()` for CSS to reach injected elements

### Git discipline
- One commit per logical concern — never batch unrelated changes
- Commit message format: `type: short description`
- Always add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- Types used: `feat`, `fix`, `ci`, `content`, `refactor`

### What NOT to do
- Do not install React, Vue, Tailwind, or any component library
- Do not add CSS frameworks or utility class systems
- Do not use `dist/` contents as reference — always read `src/`
- Do not change design tokens without explicit instruction
- Do not add comments or docstrings to unchanged code
- Do not create abstractions for one-off patterns

### Running Node
Node is managed via `.zshrc`. Always prefix shell commands with `source ~/.zshrc &&` when Node is needed (e.g. `npm run build`).
