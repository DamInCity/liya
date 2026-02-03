```markdown
# Top SEO Sites – Build Spec (AI-Ready)

This document is a **strict implementation brief** for building the “Top SEO Sites” landing page. It is designed for an AI agent or junior dev; avoid improvisation and follow the specs exactly.

---

## 1. Project constraints

- One single-page site.
- No other pages, no blog, no CMS.
- Tech:
  - React + Vite (or Next.js, but still single page).
  - Framer Motion for animation.
  - Lenis for smooth scrolling and scroll tracking. [web:17][web:20]
- No changes to:
  - Color palette.
  - Typography.
  - Spacing system.
  - Component structure.
- All design decisions are defined below. Do not “improve” them.

---

## 2. Brand & art direction

### 2.1 Color palette (fixed)

Use **only** these colors; do not introduce new ones. Values are hex codes.

- `--bg-main: #05060A;`        // near-black background.
- `--bg-elevated: #0B0D14;`   // elevated cards, sections.
- `--text-primary: #F5F7FF;`  // main text.
- `--text-muted: #9EA3B8;`    // secondary text.
- `--accent: #4EE1A0;`        // primary accent (SEO / growth).
- `--accent-soft: rgba(78, 225, 160, 0.18);` // glows, borders.
- `--border-subtle: rgba(255, 255, 255, 0.06);`
- `--danger: #FF4D67;`        // error states.
- `--surface-glass: rgba(13, 17, 25, 0.80);` // glassmorphism panels.

Background gradient (hero only):

```css
background:
  radial-gradient(circle at 10% -10%, rgba(78, 225, 160, 0.22), transparent 55%),
  radial-gradient(circle at 120% 20%, rgba(84, 196, 255, 0.18), transparent 55%),
  radial-gradient(circle at 50% 120%, rgba(255, 77, 103, 0.18), transparent 55%),
  #05060A;
```

The rest of the page uses solid `--bg-main`.

### 2.2 Typography (fixed)

Use **exactly** these fonts and roles:

- Display / Headings: **Geist** (or `"Geist", system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`). Geist is widely used in modern web design and portfolios. [web:19]
- Body text: same font family, different weights.
- Do not add a serif, do not use any other typeface. Minimal palettes often reuse a single grotesk across headings and body for cohesion. [web:18]

Use the following sizes on desktop:

```css
:root {
  --font-display-xl:  clamp(3.4rem, 6vw, 4.6rem);  /* hero */
  --font-display-lg:  clamp(2.4rem, 4vw, 3.2rem);  /* section titles */
  --font-display-md:  clamp(1.6rem, 2.6vw, 2.0rem);/* subheads */

  --font-body-lg:     1.1rem;
  --font-body-md:     0.98rem;
  --font-label:       0.82rem;
}
```

Weights:

- Headings: `600` or `700`.
- Body: `400`.
- Labels / overlines: `500`, uppercase, letter-spacing: `0.14em`.

---

## 3. Layout system

### 3.1 Grid & breakpoints

- Maximum width: `1180px` content, centered.
- Page padding:
  - Desktop: `padding-inline: 3rem; padding-block: 3.5rem;`
  - Tablet: `2rem`.
  - Mobile: `1.5rem`.
- Breakpoints:
  - `@media (max-width: 1024px)` – collapse to single-column sections.
  - `@media (max-width: 768px)` – reduce paddings and font sizes (via `clamp` above, not custom mobile styles per section).

Base spacing scale (use this only):

- `--space-1: 4px;`
- `--space-2: 8px;`
- `--space-3: 12px;`
- `--space-4: 16px;`
- `--space-5: 24px;`
- `--space-6: 32px;`
- `--space-7: 40px;`
- `--space-8: 56px;`
- `--space-9: 72px;`
- `--space-10: 96px;`

---

## 4. Page structure

Implement exactly these sections in this order, as a single scroll page:

1. `Hero`
2. `ServicesStrip` (“What we do in 10 seconds”)
3. `SitesGallery` (Top SEO sites)
4. `ThinkingMarquee` (“How we think”)
5. `CTASection` (main call-to-action)
6. `Footer`

Add one `ScrollProgress` component and one `CustomCursor` that live at the app root and overlay all sections.

---

## 5. Components and behavior

### 5.1 Global shell

`App.tsx` (or `page.tsx` in Next):

- Wrap with:
  - `<LenisProvider>` for smooth scroll (implementation using lenis-js). [web:20]
  - `<CustomCursorProvider>` to track mouse position and state.
- Render sections in order with IDs:
  - `#hero`
  - `#services`
  - `#sites`
  - `#thinking`
  - `#cta`
- Render `<ScrollProgress />` aligned to the right edge.

---

### 5.2 Custom cursor

#### Visual design

Cursor consists of two layers:

- Inner dot:
  - Size: `8px`, color: `#F5F7FF`.
- Outer ring:
  - Base size: `32px`, border: `1px solid rgba(245, 247, 255, 0.5);`
  - Blend mode: `mix-blend-mode: difference;`
  - Background: transparent.

States (controlled via data attribute or class):

- `data-cursor="default"`: base size.
- `data-cursor="link"`: outer ring `scale(1.3)`, border color `--accent`.
- `data-cursor="cta"`: outer ring `scale(1.6)`, background `--accent-soft`, show text label inside (e.g., “Start”).
- `data-cursor="drag"`: ring becomes `40x40px`, tiny arrow icon inside.

Implementation notes:

- Use requestAnimationFrame or Framer Motion `useSpring` for smooth follow.
- Hide on touch devices.

---

### 5.3 Scroll progress / section tracker

Right side vertical tracker:

- Position:
  - Fixed, right: `32px`, top: `50%`, transform: translateY(-50%).
- Track:
  - Height: `220px`, width: `2px`, background: `rgba(255, 255, 255, 0.16)`, border-radius: `999px`.
- Thumb:
  - Width: `6px`, height: `36px`, border-radius: `999px`, background: `--accent`.

Behavior:

- Thumb position driven by global scroll progress from Lenis: `0` (top of page) to `1` (bottom). [web:17][web:20]
- When a section becomes active (based on intersection observer or progress ranges), briefly:
  - Expand thumb width to `10px`.
  - Show a small floating label (section name) to the left with fade-in/out.

Sections and labels mapping:

- `#hero` → “Intro”
- `#services` → “Services”
- `#sites` → “Top SEO Sites”
- `#thinking` → “How we think”
- `#cta` → “Let’s talk”

---

### 5.4 Hero section

Layout:

- Full viewport height: `min-height: 100vh`.
- Two-column grid:
  - Left: 60% width on desktop (headline, subcopy, primary CTA).
  - Right: 40% width (floating metric tiles).
- On tablet/mobile: stack columns (left content first, right metrics below).

Content (use this exact structure; wording can be tweaked later but layout stays):

- Overline: “SEO-FIRST WEB EXPERIENCES”.
- Main heading: “Top SEO Sites That Look Like Awwwards And Rank Like Crazy.”
- Subcopy: two short lines, e.g., “We design and build search-obsessed websites that look boutique and behave like performance machines.”
- Primary CTA button:
  - Label: “Show me what’s possible”.
  - Secondary text under button: “Get a 1‑minute Loom teardown + concept.”

Right side visual:

- 3 floating metric tiles in a staggered vertical layout:
  - Tile 1: “+238%” (label: “Organic traffic in 6 months”).
  - Tile 2: “4.7x” (label: “Qualified leads”).
  - Tile 3: “12/10” (label: “Client satisfaction”).
- Tiles use `--bg-elevated`, border `--border-subtle`, subtle glow (shadow) using `--accent-soft`.

Motion (Framer Motion):

- On initial load:
  - Hero text fades in with slight Y offset (40px → 0).
  - Tiles slide in from right with stagger (0.1s).
- On scroll:
  - Whole hero slowly translates up (parallax) at 0.9x scroll speed.
- On hover over CTA:
  - Apply `data-cursor="cta"`.

---

### 5.5 ServicesStrip (“What we do in 10 seconds”)

Location: directly under hero, background `--bg-main`.

Layout:

- Full-width band.
- Title row: left-aligned label “What we do”, right-aligned short supporting line.
- Cards row (desktop):
  - 3 cards in a row (equal width).
  - On tablet/mobile: stack vertically.

Cards (exact three):

1. “Strategy & Positioning”
2. “Technical SEO & Performance”
3. “Conversion & Story”

Each card:

- Container: `--bg-elevated`, border `--border-subtle`, border-radius `18px`, padding `--space-6`.
- Title + 2–3 bullet lines (no icons, just text).
- Accent underline under title using a 2px gradient bar (`--accent` to a cyan-like `#54C4FF`).

Motion:

- Cards slide up on scroll with fade (`opacity: 0 → 1`, `translateY: 24px → 0`).
- Hover:
  - Slight scale (`1 → 1.02`).
  - Elevate shadow using `--accent-soft`.
  - `data-cursor="link"` for the card area.

---

### 5.6 SitesGallery (Top SEO Sites)

This is the central “wow” zone.

Layout:

- Each project is a full-viewport-height section.
- Use scroll snapping:
  - `scroll-snap-type: y mandatory;` on main container.
  - Each project section: `scroll-snap-align: start;`.
- Desktop layout:
  - Left: visual mockup (70% width).
  - Right: project meta + metrics (30% width).
- On mobile: stack, with visual first.

Project structure (repeatable):

- Label: “Top SEO Site 01”, “Top SEO Site 02”, etc.
- Project name: “Acme Analytics”.
- Context line: “B2B SaaS • Technical SEO + conversion redesign”.
- Metrics:
  - “+230% organic traffic (6 months)”
  - “3.9x demo requests”
- Short 2-line description of the work.

Visual mockup:

- Use a single shared style:
  - Large rounded rectangle (like a browser window), background `#0F1118`.
  - Top bar with three tiny circles (red, amber, green) like a Mac window.
  - Inside, a simple layout: big headline block and 2–3 thin gray bars to represent content.
- Add 2–3 floating “chips” around the window:
  - Chip example: `“+230% SEO traffic”`, `“Core Web Vitals green”`.

Parallax:

- Implement a `<ParallaxLayer>` component that takes a `depth` prop (`-0.2` to `0.2`) and translates elements based on scroll.
- For each project:
  - Background glow: `depth = 0.1`.
  - Main window: `depth = 0`.
  - Metric chips: `depth = -0.15` and `-0.2`.
- Optional: also respond subtly to mouse (x, y) for tilt (but keep within `transform: rotateX(4deg) rotateY(4deg)` max).

Motion:

- Section enters:
  - Fade in, short Y movement (24px).
  - Metric numbers count up once when section becomes active.
- When section is active:
  - Cursor accent color can change to a project-specific accent (choose 2–3 variants based on accent hue shift, but keep global `--accent` dominant).

---

### 5.7 ThinkingMarquee (“How we think”)

Narrow strip between gallery and main CTA.

Design:

- Full width.
- Background: `linear-gradient(90deg, rgba(78, 225, 160, 0.06), rgba(84, 196, 255, 0.06));`
- Height: `64px` on desktop.
- Text: repeating phrases in one line, e.g.,
  - “Speed • Structure • Search Intent • Story • Speed • Structure • Search Intent • Story • …”

Implementation:

- Use CSS-based marquee:
  - Inner content container with `display: inline-flex; gap: 48px;`.
  - Animation: `transform: translateX(0 → -50%)` infinite linear.
- Hover:
  - Pause animation (set animation-play-state: paused).
  - `data-cursor="link"`.

---

### 5.8 CTASection (main conversion area)

Design:

- Centered, card-like section.

Layout:

- Background: `--bg-main`.
- Inside: glass card with `--surface-glass`, blur `18px`, border `--border-subtle`, radius `24px`, padding `--space-8`.
- Two columns:
  - Left: headline + short convincing copy.
  - Right: form.

Copy structure:

- Label: “Ready when you are”.
- Heading: “Want a Top SEO Site that looks like this?”
- Subcopy: one short paragraph.

Form:

- Fields:
  - “Name” (text)
  - “Work email” (email)
  - “Website or product URL” (text)
  - “What’s the main goal?” (textarea, 3–4 rows)
- Small note under form: “We’ll send a 1‑minute Loom teardown and a rough concept within 24 hours.”

UI specifics:

- Inputs:
  - Background: `rgba(5, 6, 10, 0.9)`.
  - Border: `--border-subtle`; on focus, border `--accent` and subtle glow (`box-shadow: 0 0 0 1px rgba(78,225,160,0.4)`).
- Submit button:
  - Label: “Get my teardown”.
  - Background: `--accent`.
  - Text: `#05060A`.
  - Hover: slight lift and glow.

Sticky CTA bar:

- Appears once user scrolls past hero:
  - Small bar pinned to bottom on desktop only.
- Content:
  - Text: “Want a site that looks this good and prints leads?”
  - Button: same as primary CTA, smaller.
- Background: `--surface-glass`.

---

### 5.9 Footer

Very minimal:

- Single row:
  - Left: © Top SEO Sites, current year.
  - Right: small text “Built for results-first brands, not templates.”

No social icons, no extra clutter.

---

## 6. Motion primitives

Define these primitives once and reuse:

1. `fadeInUp` variant:
   - `initial: { opacity: 0, y: 32 }`
   - `whileInView: { opacity: 1, y: 0 }`
   - `transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] }`
2. `staggerChildren` for groups:
   - `transition: { staggerChildren: 0.08 }`
3. Parallax hook:
   - Takes scroll progress (0–1) and depth factor; returns a transform style with translateY.

Ensure animation curve consistency across sections for a premium feel, as seen on modern dark portfolios and minimalist designs. [web:13][web:18]

---

## 7. Performance & responsiveness rules

- Reduce motion on `prefers-reduced-motion`:
  - Disable marquee animation.
  - Remove parallax transforms (use static layout).
- Mobile:
  - Disable custom cursor.
  - Reduce shadows and blurs if performance is poor.
- Do not use large background images; rely on gradients and solid colors. Dark mode palettes with simple gradients are effective and performant. [web:11][web:12][web:15]

---

## 8. File / component outline

Suggested structure:

- `src/`
  - `App.tsx`
  - `main.tsx`
  - `styles/`
    - `globals.css`
    - `tokens.css` (colors, typography, spacing, etc.)
  - `components/`
    - `layout/PageShell.tsx`
    - `layout/ScrollProgress.tsx`
    - `cursor/CustomCursor.tsx`
    - `scroll/LenisProvider.tsx`
    - `scroll/ParallaxLayer.tsx`
    - `sections/Hero.tsx`
    - `sections/ServicesStrip.tsx`
    - `sections/SitesGallery.tsx`
    - `sections/ThinkingMarquee.tsx`
    - `sections/CTASection.tsx`
    - `sections/Footer.tsx`

The AI agent should start by:

1. Implementing `tokens.css` with the exact colors, typography, and spacing defined here.
2. Implementing `LenisProvider` based on the lenis-js README and smooth scroll examples. [web:17][web:20]
3. Implementing `CustomCursor` strictly as described.
4. Building each section as a separate component, in the order given, using Framer Motion for the defined animations.

No new styles, colors, fonts, or layout systems should be invented beyond what is in this document.
```