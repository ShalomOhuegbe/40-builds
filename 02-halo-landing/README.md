# 02 · HALO Landing Page

> Build 02 of [40 Builds](../README.md): a design engineering build-in-public challenge.

## What it is

A product landing page for **HALO**, a fictional smart desk lamp that adapts its colour temperature to your focus sessions. The page is a faithful implementation of a Figma design (desktop 1440, tablet 768, mobile 390, plus an interaction-notes frame). Its centrepiece is a pinned scroll story in which the lamp moves through the working day, from cool focus light to warm wind-down light.

## Design decisions

- **Figma is the source of truth.** Colours, type styles, spacing and radii are mirrored 1:1 from the Figma variables in [`src/styles/tokens.css`](src/styles/tokens.css) and exposed as Tailwind utilities (`bg-canvas`, `text-on-dark-muted`, `type-display-l` …). Letter-spacing is converted from Figma's percentages to `em`, so it scales with font size.
- **Typography:** Space Grotesk (300/500) for display, headings and numerals; DM Sans (400/500, optical size 14) for body and labels, matching the Figma text styles.
- **Mixed light/dark composition.** The design deliberately alternates dark sections (hero, stage, footer, Pro card) with warm off-white ones. There is no OS dark theme because it would invert the design's rhythm. Focus rings switch automatically: near-black on light surfaces, amber on dark ones (`on-dark-surface`).
- **Three real layouts.** Mobile, tablet and desktop are each built from their own Figma frame, not by scaling one layout: stacked hero with full-width CTAs, a testimonial swipe carousel, Pro listed first in pricing, a marquee spec ticker. Copy that Figma shortens on small screens is shortened here too.
- **Signature interaction: the pinned scroll story.** The interaction notes specify it precisely: the dark stage pins for 300vh, and scroll progress maps to lamp temperature (Cool → Neutral → Warm, 400ms crossfade), the knob position and a counting Kelvin readout. Each feature callout activates for its third of the scroll: an amber rule draws left → right and the text fades from 45% to 100%.
- **Mobile pinning:** the full stage plus three callouts doesn't fit a phone viewport, so on mobile the stage pins under the nav while the callouts scroll up into view beneath it. The active callout is always the readable one.
- **Fluid between frames:** between 1200px and 1440px, display type and the hero lamp scale with the viewport. On short desktop screens the stage shrinks by aspect ratio so the pinned row always fits.

## Technical highlights

- **Vite 8 + React 18 + TypeScript (strict)**, Tailwind CSS v4 (`@theme`, custom `@utility` type styles), Framer Motion and lucide-react. No GSAP: Framer's `useScroll` plus `position: sticky` covers the pinned story without another dependency.
- **One progress value drives the whole story.** `useScroll` on the 300vh track feeds a spring-smoothed `MotionValue`, which is used for the knob position, the Kelvin readout (piecewise 6500 → 4000 → 2700, so it agrees with the scale), the cool/warm ambient glow balance and the state thresholds. The readout renders straight from the motion value, so scrolling triggers no React re-renders.
- **Crossfading the real Figma lamp variants without a dip.** The three Lamp variants (Cool/Neutral/Warm) are identical artwork apart from the light colour. Stacking them with `mix-blend-mode: plus-lighter` makes identical pixels add back up to 100% mid-fade. Only the light shifts, and the aluminium arm never flickers.
- **Geometry from the design, not eyeballed.** Every lamp is anchored by its desk contact line (604/640 of its frame, from the component description). Scenes use percentages of their Figma frames, or container-query units (`cqw`) in Focus Mode, so the lamp sits on the desk at any width. Section heights at 1440 match the Figma frames to within 1px.
- **Every Figma asset is used as exported:** 25 SVGs in `src/assets/figma`, no redrawn icons or stock imagery. Duplicate exports that differed only in box size (`preserveAspectRatio="none"`, identical gradients) were collapsed into one file each.
- **Working interactions:**
  - Sticky nav with Top → Scrolled states on desktop and mobile, plus an accessible mobile menu (Escape closes, focus is managed).
  - Selectable pricing cards backed by a real radio group; the CTA follows the selection and has reserving and reserved states.
  - Single-open FAQ accordion: height animates `0 → auto` in 240ms and the plus rotates into the minus.
  - Scroll-snap testimonial carousel with synced pagination.
  - Newsletter form with validation, submitting and success states.
  - Footer plan links preselect that plan.
- **Accessibility:**
  - Semantic landmarks, a skip link and labelled sections.
  - The stage is announced as one image with a live state label.
  - Callouts expose `aria-current="step"`, and plan features are announced as included or not included.
  - Visible focus everywhere.
  - Reduced motion makes every transition instant, stops the marquee (it becomes swipeable) and removes the scroll smoothing.

## Live demo

_Coming soon_. To deploy on Vercel, set this folder (`02-halo-landing`) as the project's Root Directory.

## Screenshots

| Mobile (390px) | Tablet (768px) | Desktop (1440px) |
| --- | --- | --- |
| _screenshot_ | _screenshot_ | _screenshot_ |

## Notes on the design

- **Not built:** the desktop "Scroll states" storyboard under the stage. It's a design annotation of the three pinned states and doesn't appear in the tablet or mobile frames.
- **Contrast (WCAG AA) issues in the Figma palette:**
  - `text/secondary` #77766f on the canvas measures about 4.2:1 and on the sunken background about 3.9:1, both short of AA (4.5:1) for 14–16px text. On white it's about 4.6:1, which passes.
  - The amber eyebrow labels (#e9a94b on #f7f6f2) measure about 1.9:1.
  - These are kept exactly as designed. Darkening `text/secondary` to about #6b6a64 in Figma would pass AA with almost no visual change.
- **Simulated flows:** pre-order and newsletter submissions are simulated, because this is a design study with no backend or payment flow. The UI says so.

## Run locally

```bash
npm install
npm run dev
```
