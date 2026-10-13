# 40 Builds — rules for every project

A design engineering build-in-public challenge: 40 small, polished projects.

## Repository layout

- Each build lives in its own folder named `NN-slug` (e.g. `01-word-puzzle`) and is an independent Vite + React 18 + TypeScript app with its own `package.json` and lockfile.
- Scaffold new builds with `npm run new -- NN-slug` from the repo root. Never hand-copy `_template/`.
- `_template/` is the source for new builds. Change it only when a change should apply to all future builds.
- When a build ships, update its row in the root `README.md` (live link + status ✅ Live) and fill in its own README.
- Work only inside the build being worked on unless asked otherwise.

## Stack

Vite, React 18, TypeScript (strict), Tailwind CSS v4, Framer Motion, lucide-react. Styling flows from `src/styles/tokens.css` — use tokens, not hard-coded values. Deployed to Vercel with each build folder as its own project root.

## Design rules

1. **Distinctive identity.** Give every project its own visual identity and an appropriate Google Fonts pairing. Avoid generic SaaS styling, default Inter typography and purple gradients. Rewrite `tokens.css` (palette, fonts, radius) per build.
2. **Mobile-first.** Design for small screens first and support widths down to 360px with no horizontal scroll.
3. **Accessible by default.** Semantic HTML, full keyboard navigation, visible focus states, WCAG AA contrast in both light and dark themes, and respect `prefers-reduced-motion` (Framer Motion is wrapped in `MotionConfig reducedMotion="user"`).
4. **Realistic content.** Use realistic sample data. Never lorem ipsum.
5. **Every state.** Include loading, empty and error states wherever data appears.
6. **One signature interaction.** Pick one interaction per build and make it exceptional.
7. **Lean code.** Keep components small and readable. No unused dependencies, files or exports.
8. **Figma first.** If a Figma link is provided, follow that design closely.

## Before calling a build done

- `npm run build` passes with no type errors.
- Checked at 360px, tablet and desktop widths, in light and dark.
- Tab through every interactive element; focus is always visible.
- Reduced-motion preference tested.
- Project README sections completed (What it is, Design decisions, Technical highlights, Live demo, Screenshots).
