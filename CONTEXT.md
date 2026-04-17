# Fretboard Theory — Project Context & Handoff Document v4.0

> **Purpose:** Attach this to any new Claude chat to resume development instantly.
> Say: "I am building the Fretboard Theory app. This document has full context.
> I am currently at [describe where you are]. Help me continue."
>
> **Version:** 4.0 — Updated after layout redesign, design token system, and diatonic triads complete
> **Date:** April 2026

---

## 1. Project Overview

**Fretboard Theory** is an interactive guitar music theory web application being built
by Zaid as both a personal practice tool and a public portfolio project.

### Vision
> "An intelligent guitar learning companion that makes music theory visual,
> interactive, and personal — from your first scale to your first improvised solo."

### Target User
Intermediate guitarists who know scales and chords but want to improvise better.
Built as a public tool other guitarists will actually use.

### Live URLs
- **GitHub:** `https://github.com/shaikzaiduddin/fretboard-theory`
- **Vercel (live):** Auto-deploys on every push to `main`
- **Local dev:** `npm run dev` → `http://localhost:5173`
- **Local path:** `~/Projects/fretboard-theory`

---

## 2. Roadmap Status

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Foundation | Complete | React + TypeScript migration, all theory features, 49 tests |
| 2 — Visual Polish | Complete | Framer Motion animations, fret slider, fretboard improvements |
| 3a — Layout Redesign | Complete | Top-bar layout, design tokens, colour system, diatonic triads |
| 3b — Artist Feature | Next | Solo Guide artist tab, Claude API integration |
| 3c — Quiz Engine | Planned | Chord-to-scale quiz, arpeggios, progressive difficulty |
| 4 — Audio Input | Planned | Real-time pitch detection from guitar via audio interface |
| 5 — Chord Detection | Planned | Python FastAPI backend, librosa FFT chord analysis |
| 6 — AI Companion | Planned | LLM-powered practice suggestions and solo analysis |

### Phase 3a Complete — What Was Built (April 2026)

**Layout redesign:**
- Full top-bar layout replacing old sidebar
- Order: Header → KeyRow → ControlsRow → InfoBar → Fretboard → ChordGrid → SoloGuide
- New folder `src/components/TopBar/` for new layout components
- Old `src/components/Sidebar/` retained on disk but no longer imported
- React Router not yet installed (deferred until quiz engine work begins)

**Design system:**
- Complete CSS custom property token system in `src/index.css`
- Single merged `@theme inline` block for fonts + Tailwind colour bridge
- Google Fonts added: Playfair Display (serif), DM Sans (UI), DM Mono (mono)
- New `.vscode/settings.json` suppresses Tailwind v4 linter warnings
- Custom hover utilities added (`hover-bg-popover`, `hover-text-secondary`, etc.)
- Shared `control-select` class for dropdowns with custom chevron SVG

**Colour system:**
- New file `src/lib/colors.ts` — single source of truth for all note/interval colours
- Per-interval unique colours (12 distinct hues) — learners can identify any
  interval by colour alone
- `ROLE_COLORS` in `theory.ts` updated to match
- `getIntervalColor()`, `getVariantColor()`, `getIntervalBgColor()`,
  `getIntervalBorderColor()` helpers

**Category/Pattern linking:**
- Pattern dropdown now filters by category
- Scales category excludes modes (filtered at UI layer, not data layer)
- Modes category shows all 7 modes
- Data in `SCALE_PATTERNS` unchanged — still includes modes with `mode:true` flag

**Diatonic triad mode:**
- New `IntervalMapValue` interface in `useFretboard.ts` with `colorOverride`
  and `isChordRoot` fields
- When `category === 'triads' && triadMode === 'diatonic'`:
  - All 7 diatonic chord roots shown simultaneously
  - Colour-coded by chord quality: gold (maj), green (min), red (dim),
    purple (aug)
  - All chord root dots get a glow ring (tonic gets double ring)
  - Interval is stored as semitone distance from key tonic (not from chord root)
  - Degree field holds Roman numeral (I, ii, iii, IV, V, vi, vii°)
- String Set filter control revealed when diatonic mode is active
- Filter options: All strings, Str 1-3, Str 2-4, Str 3-5, Str 4-6

**Solo Guide redesign:**
- 2-column grid layout (`gridTemplateColumns: '1fr 2fr'`)
- Left column: Landing Notes (with tier pills) + Note Strength Map
- Right column: Theory text + Pro Move tip
- StrengthMap rewritten as vertical bar chart with percentage-fill bars
- Bar heights: anchor=100%, colour=75%, passing=50%, neutral=35%, avoid=15%
- Gradient fills with subtle glow shadows

**InfoBar enhancements:**
- Chord quality legend replaces scale info when diatonic mode is active
- Shows all 7 diatonic chords as coloured pills with Roman numerals + quality
- Dot colours on fretboard match pill colours — instant cross-reference

**Fretboard fixes:**
- ViewBox aspect ratio corrected (was 3.1:1, now 5.86:1)
- Container uses `maxHeight: 300` with `overflow: hidden`
- `DOT_RADIUS` reduced from 8 to 6 to match compact coordinate system
- Inlay dot offsets updated from +/-26 to +/-20 for new `FB_HEIGHT=100`
- Fret slider removed from FretboardCanvas (moved to ControlsRow — no duplicates)
- All strings always visible at any screen width (no clipping)

### Deferred to Phase 3c (Quiz)
- React Router installation
- `/quiz` route and QuizPage
- QuizPanel, QuizQuestion, QuizFeedback, QuizProgress components
- Arpeggio category in PATTERNS_BY_CATEGORY
- Verify quizData.ts and useQuizStore tests

### Deferred to Phase 3b (Artist — next up)
- `src/data/artistProfiles.ts` — 8 hardcoded artist profiles
- Artist tab inside Solo Guide
- Dropdown + custom search UI
- Claude API integration for dynamic artist profiles
- Fretboard auto-load artist's primary scale/mode

---

## 3. Tech Stack

| Concern | Technology | Notes |
|---------|-----------|-------|
| Framework | React 18 + TypeScript | Strict mode enabled |
| Build tool | Vite 5 | Hot reload, production bundling |
| Styling | Tailwind CSS v4 | Vite plugin — NO config file, `@import "tailwindcss"` in index.css |
| State | Zustand | useTheoryStore, useUIStore, useQuizStore (written, untested) |
| Animation | Framer Motion | Throughout UI |
| Physics | React Spring | Installed, reserved for Phase 4+ |
| Fretboard | SVG now, PixiJS in Phase 4 | SVG for correctness, WebGL for 60fps audio |
| Routing | React Router (not yet installed) | Will install for `/quiz` route |
| Pitch detection | Pitchy (Phase 4) | MPM algorithm, <50ms latency |
| Backend | FastAPI Python (Phase 5) | WebSocket, librosa chord detection |
| Testing | Vitest + React Testing Library | 49 tests currently passing |
| CI/CD | GitHub to Vercel | Auto-deploy on push to main |
| Fonts | Google Fonts | Playfair Display, DM Sans, DM Mono |

### Critical Config Notes

**Tailwind v4** — no init command, no config file:
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { globals: true, environment: 'jsdom', setupFiles: './src/tests/setup.ts' }
})
```
```css
/* src/index.css */
@import "tailwindcss";

:root {
  /* Design tokens — see Section 7 for full list */
}

@theme inline {
  /* Fonts + colour bridge merged in single block */
}
```

**Vitest** — must import from `vitest/config` not `vite`:
```ts
import { defineConfig } from 'vitest/config'
```

**VS Code** — suppress Tailwind v4 linter warnings:
```json
// .vscode/settings.json
{
  "css.lint.unknownAtRules": "ignore",
  "tailwindCSS.experimental.configFile": null
}
```

**Font loading** — in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

---

## 4. Current File Structure

```
fretboard-theory/
├── .vscode/
│   └── settings.json                    ← Tailwind linter suppression
├── src/
│   ├── components/
│   │   ├── Fretboard/
│   │   │   ├── FretboardCanvas.tsx      ← SVG renderer with chord-root glow rings
│   │   │   └── useFretboardDraw.ts      ← coordinate maths (reads colorOverride)
│   │   ├── TopBar/                      ← NEW — replaces Sidebar
│   │   │   ├── Header.tsx               ← app title + Explore/Quiz nav
│   │   │   ├── KeyRow.tsx               ← 12 root note buttons full-width
│   │   │   └── ControlsRow.tsx          ← category, pattern, triad view, string set, labels, strings, tuning, frets
│   │   ├── Sidebar/                     ← RETIRED — files exist but not imported
│   │   │   ├── KeyGrid.tsx              ← (unused)
│   │   │   ├── PatternList.tsx          ← (unused)
│   │   │   └── StringConfig.tsx         ← (unused)
│   │   ├── SoloGuide/
│   │   │   ├── SoloGuide.tsx            ← 2-column layout, notes left + theory right
│   │   │   └── StrengthMap.tsx          ← vertical bar chart with percentage fills
│   │   ├── InfoBar.tsx                  ← scale name + pills, OR chord legend in diatonic mode
│   │   └── ChordGrid.tsx                ← diatonic chord cards with stagger animation
│   ├── data/
│   │   ├── theory.ts                    ← NOTES, ROLE_COLORS (expanded), normalise(), noteName(), buildNoteSet(), buildIntervalMap()
│   │   ├── scales.ts                    ← SCALE_PATTERNS, TRIAD_PATTERNS, SEVENTH_PATTERNS, MODES_ONLY, DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS, PATTERNS_BY_CATEGORY
│   │   ├── tunings.ts                   ← TUNING_PRESETS (6/7/8 string)
│   │   ├── soloGuides.ts                ← SOLO_GUIDES keyed by scale name
│   │   └── quizData.ts                  ← generateQuestion(), CHORD_SCALE_ENTRIES (written, needs verification)
│   ├── hooks/
│   │   └── useFretboard.ts              ← IntervalMapValue, CHORD_QUALITY_COLORS, diatonic branch
│   ├── lib/
│   │   └── colors.ts                    ← NEW — INTERVAL_COLORS, VARIANT_COLORS, getIntervalColor(), etc.
│   ├── stores/
│   │   ├── useTheoryStore.ts            ← root, category, pattern, tuning, triadMode, stringSet, numFrets
│   │   ├── useUIStore.ts                ← soloGuideOpen, theme, lessonTab
│   │   └── useQuizStore.ts              ← written, needs verification
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── theory.test.ts               ← 11 tests
│   │   ├── scales.test.ts               ← 9 tests
│   │   ├── tunings.test.ts              ← 8 tests
│   │   ├── soloGuides.test.ts           ← 5 tests
│   │   ├── useTheoryStore.test.ts       ← 16 tests
│   │   └── quizData.test.ts             ← written, needs verification
│   ├── types/
│   │   └── index.ts                     ← all interfaces (see Section 5)
│   ├── App.tsx                          ← top-bar layout, no sidebar
│   ├── main.tsx
│   └── index.css                        ← design tokens, @theme inline, hover utilities
├── index.html                           ← Google Fonts preconnect + link
├── CONTEXT.md                           ← project context (this file's predecessor)
├── FRETBOARD_THEORY_CONTEXT_V4.md       ← this file
├── README.md
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json                    ← strict: true, noUnusedLocals, noUnusedParameters
└── package.json
```

---

## 5. TypeScript Types

```ts
// src/types/index.ts
export type NoteName = 'C'|'C#'|'D'|'D#'|'E'|'F'|'F#'|'G'|'G#'|'A'|'A#'|'B'
export type Category = 'scales'|'triads'|'seventh'|'modes'
export type LabelMode = 'note'|'interval'|'none'
export type StringCount = 6|7|8

export interface ScalePattern {
  name: string; intervals: number[]; steps: string; degrees: string[]; mode?: boolean
}

export interface SoloGuide {
  s1: number[]  // anchor
  s2: number[]  // colour
  s3: number[]  // passing
  av: number[]  // avoid
  theory: string
  tip: string
}

export interface TuningPreset {
  label: string
  tunings: Record<StringCount, number[]>
}

export interface FretboardNote {
  string: number; fret: number; interval: number; degree: string
}

// Quiz types
export type QuizLevel = 1|2|3
export interface QuizQuestion { /* ... */ }
export interface QuizAnswer   { /* ... */ }
export interface QuizProgress { /* ... */ }
export interface QuizSession  { /* ... */ }
```

```ts
// src/hooks/useFretboard.ts — NEW exported type
export interface IntervalMapValue {
  interval:       number        // semitones from key tonic
  degree:         string        // interval label OR Roman numeral
  colorOverride?: string        // set in diatonic mode for chord quality colour
  isChordRoot?:   boolean       // triggers glow ring in diatonic mode
}
```

---

## 6. Zustand Stores

### useTheoryStore (src/stores/useTheoryStore.ts)
```ts
// State
root: number              // 0-11
category: Category        // 'scales'|'triads'|'seventh'|'modes'
patternIdx: number
labelMode: LabelMode      // 'note'|'interval'|'none'
stringCount: StringCount  // 6|7|8
tuning: number[]
tuningLabel: string       // 'Standard'|'Drop D'|'Open G'|'DADGAD'
triadMode: 'single'|'diatonic'
stringSet: string         // 'all'|'0-2'|'1-3'|'2-4'|'3-5'
numFrets: number          // default 12, min 12, max 24

// Actions
setRoot, setCategory, setPatternIdx, setLabelMode
setStringCount, setStringByIdx, setTuning, setTuningLabel
setTriadMode, setStringSet, setNumFrets, applyPreset
getCurrentPattern()
```

### useUIStore (src/stores/useUIStore.ts)
```ts
soloGuideOpen: boolean
uploadPanelOpen: boolean
theme: 'dark'|'light'
lessonTab: 'overview'|'techniques'|'theory'|'tips'
triadModeVisible: boolean

toggleSoloGuide(), toggleUploadPanel(), toggleTheme()
setLessonTab(tab), setTriadModeVisible(visible)
```

### useQuizStore (src/stores/useQuizStore.ts) — written, verify tests
```ts
// Uses zustand persist middleware
// progress: QuizProgress  — persisted to localStorage
// session: QuizSession    — NOT persisted

startSession(level?), submitAnswer(chosen), nextQuestion(), endSession(), resetProgress()
```

---

## 7. Design Token System

CSS custom properties in `src/index.css` — single source of truth for all colours,
spacing, and typography. Components reference these via `var(--token-name)` or
Tailwind utilities (where bridged via `@theme inline`).

```css
:root {
  /* Background layers */
  --background:          #0f0e0c;
  --card:                #1a1814;
  --popover:             #242018;

  /* Text */
  --foreground:          #f0ece4;
  --text-primary:        #f0ece4;
  --text-secondary:      #a09888;
  --text-muted:          #6a6050;

  /* Primary accent — Warm Gold */
  --primary:             #c9a84c;
  --accent:              #e8c97a;

  /* Borders (3 strengths) */
  --border:              rgba(255, 255, 255, 0.07);
  --border-default:      rgba(255, 255, 255, 0.14);
  --border-strong:       rgba(255, 255, 255, 0.22);

  /* Interval colours — per-degree unique */
  --interval-root:       #e8b931;
  --interval-b2:         #64b5f6;
  --interval-2:          #64b5f6;
  --interval-b3:         #4ade80;
  --interval-3:          #4ade80;
  --interval-4:          #fb923c;
  --interval-s4:         #f472b6;
  --interval-b5:         #f472b6;
  --interval-5:          #22d3ee;
  --interval-b6:         #a78bfa;
  --interval-6:          #a78bfa;
  --interval-b7:         #ec4899;
  --interval-7:          #f472b6;

  /* Solo Guide tier colours */
  --variant-anchor:      #e8b931;
  --variant-colour:      #4ade80;
  --variant-passing:     #64b5f6;
  --variant-avoid:       #f87171;

  /* Fretboard */
  --fretboard-wood:      #1c1508;
  --fretboard-string:    #c8b878;
  --fretboard-fret:      #5a4e38;
  --fretboard-nut:       #f5f0e0;
  --fretboard-inlay:     #2a2418;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.625rem;
  --radius-xl: 1rem;
}
```

`src/lib/colors.ts` mirrors these values as TypeScript constants because
SVG inline style props can't resolve CSS custom properties directly.

---

## 8. Music Theory Data

### Core utilities (src/data/theory.ts)
```ts
export const NOTES: NoteName[]     // ['C','C#',...,'B']
export const ROLE_COLORS: Record<number, string>  // 0-11 semitone index to colour
export function normalise(n: number): number
export function noteName(root, interval): NoteName
export function buildNoteSet(root, intervals): Set<number>
export function buildIntervalMap(root, intervals, degrees): Record<number, IntervalMapValue>
```

### ROLE_COLORS — expanded per-interval system
```ts
0:  '#e8b931'  // Root    — gold
1:  '#64b5f6'  // b2/m2   — sky blue
2:  '#64b5f6'  // 2/M2    — sky blue
3:  '#4ade80'  // b3/m3   — green
4:  '#4ade80'  // 3/M3    — green
5:  '#fb923c'  // 4/P4    — amber
6:  '#f472b6'  // b5      — pink (tritone)
7:  '#22d3ee'  // 5/P5    — teal
8:  '#a78bfa'  // b6/#5   — lavender
9:  '#a78bfa'  // 6/M6    — lavender
10: '#ec4899'  // b7/m7   — rose
11: '#f472b6'  // 7/M7    — fuchsia
```

### Scale data (src/data/scales.ts)
```ts
export const PATTERNS_BY_CATEGORY = {
  scales: SCALE_PATTERNS,   // includes modes with mode:true — filtered at UI layer
  triads: TRIAD_PATTERNS,
  seventh: SEVENTH_PATTERNS,
  modes: MODES_ONLY,
}

export const MAJOR_SCALE_INTERVALS = [0,2,4,5,7,9,11]
export const DIATONIC_QUALITIES = [
  {degree:'I', type:'maj', intervals:[0,4,7]},
  {degree:'ii', type:'min', intervals:[0,3,7]},
  {degree:'iii', type:'min', intervals:[0,3,7]},
  {degree:'IV', type:'maj', intervals:[0,4,7]},
  {degree:'V', type:'maj', intervals:[0,4,7]},
  {degree:'vi', type:'min', intervals:[0,3,7]},
  {degree:'vii°', type:'dim', intervals:[0,3,6]},
]
```

### Tunings (src/data/tunings.ts)
Stored as semitone indices (0=C, 11=B), low to high:
- Standard 6-string: [4,9,2,7,11,4] = E A D G B e
- 7-string: add 11 (low B) at index 0
- 8-string: add 6 (low F#) at index 0

---

## 9. Fretboard Architecture

### Data flow
```
useTheoryStore
    to
useFretboard (hook) produces noteSet + intervalMap + dimmedStrings + numFrets
    to
useFretboardDraw (hook) produces SVG coordinates, dot positions
    to
FretboardCanvas renders SVG with Framer Motion animated dots
```

### Layout constants (useFretboardDraw.ts)
```ts
const FB_LEFT   = 46    // string labels sit at FB_LEFT - 10
const FB_TOP    = 14    // was 28 — halved for compact layout
const FB_WIDTH  = 800
const FB_HEIGHT = 100   // was 195 — halved for 5.86:1 aspect ratio
// totalHeight = FB_TOP + FB_HEIGHT + 26 = 140
// viewBox = "0 0 820 140"
// At 1440px container width: SVG renders at 246px tall (fits without scroll)
```

### useFretboard.ts exports
```ts
export const MAX_FRETS  = 24
export const MIN_FRETS  = 12
export const FRET_DOTS  = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]
export const DOT_RADIUS = 6  // was 8 — scaled for compact coord system
```

### Diatonic mode logic
```ts
if (category === 'triads' && triadMode === 'diatonic') {
  // Pass 1: chord roots get colorOverride + isChordRoot: true
  // interval = MAJOR_SCALE_INTERVALS[di] (distance from tonic, not chord root)
  // degree = Roman numeral (I, ii, iii, etc.)

  // Pass 2: thirds and fifths get colorOverride (shared with root's chord)
  // interval = (MAJOR_SCALE_INTERVALS[di] + iv) % 12
  // Only assigned if note index not already claimed by a root in pass 1
}
```

### FretboardCanvas dot rendering
```tsx
// Tonic (isRoot true) gets DOUBLE glow ring at r=DR+3 and r=DR+1.5
// Non-tonic chord roots (isChordRoot true) get SINGLE glow ring at r=DR+1.5
// Non-root chord tones get no glow, opacity 0.82
```

---

## 10. Component Patterns

### ControlsRow category/pattern linking
```tsx
const allPatterns = PATTERNS_BY_CATEGORY[category]
const patterns = category === 'scales'
  ? allPatterns.filter(p => !p.mode)   // strip modes from scales dropdown
  : allPatterns
```

### InfoBar diatonic mode
```tsx
if (category === 'triads' && triadMode === 'diatonic') {
  return <ChordLegend />  // 7 chord pills, gold/green/red by quality
}
return <ScaleInfo />      // normal scale name + note pills
```

### Solo Guide 2-column grid
```tsx
<div
  className="p-5 grid gap-8 border-t"
  style={{
    gridTemplateColumns: '1fr 2fr',  // left 1/3, right 2/3
    borderColor: 'var(--border)',
  }}
>
  <div>{/* Landing notes + StrengthMap */}</div>
  <div>{/* Theory + Pro Move */}</div>
</div>
```

### StrengthMap bars
```tsx
// Each bar: container height 56, fill height = strengthPercent %
// s1 (anchor) = 100%, s2 (colour) = 75%, s3 (passing) = 50%
// neutral = 35%, av (avoid) = 15%
// Fill: linear-gradient(180deg, color, color80)
```

---

## 11. Animation Patterns (Framer Motion)

**Dot stagger** (FretboardCanvas):
```tsx
initial={{ opacity: 0, scale: 0.4 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.3 }}
transition={{ duration: 0.2, delay, ease: 'easeOut' }}
style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
```

**Accordion** (SoloGuide body):
```tsx
<AnimatePresence initial={false}>
  {sgOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    />
  )}
</AnimatePresence>
```

**Stagger variants** (InfoBar, ChordGrid):
```tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}
```

**Spring press** (KeyRow buttons):
```tsx
whileTap={{ scale: 0.93 }}
whileHover={{ scale: 1.05 }}
transition={{ type: 'spring', stiffness: 400, damping: 17 }}
```

---

## 12. Development Workflow

```bash
cd ~/Projects/fretboard-theory
npm run dev          # localhost:5173
npm test             # watch mode — 49 tests
npx tsc --noEmit     # type check
npm run build        # production build
```

```bash
git add .
git commit -m "feat: description"
git push             # triggers Vercel auto-deploy
```

### Commit conventions
feat, fix, chore, refactor, test, docs

### Definition of Done (per feature)
- TypeScript compiles with zero errors
- ESLint passes with zero warnings (except `tailwindcss/no-arbitrary-value` — style only)
- Tests written and passing
- Manually verified in browser
- Committed and pushed

---

## 13. Known Patterns and Gotchas

### TypeScript
- Unused destructured values: `([, value])` not `([_key, value])`
- Unused parameters: prefix with `_`
- `noUnusedLocals` enforced — every import must be used

### Character encoding in code files
- Avoid em dashes, curly quotes, and other Unicode typographic characters
- Some editor/terminal combos corrupt them into multi-byte sequences that break TS parser
- Symptom: "parameter declared but never read" + unexpected `}` errors
- Fix: use plain ASCII in code comments — "->" instead of em dash, straight quotes only

### Zustand
- Stores are singletons — reset in `beforeEach` in tests
- Use `getState()` / `setState()` in tests, not the hook

### Framer Motion
- `transformOrigin` required on SVG `motion.g` — set to `${dot.x}px ${dot.y}px`
- `AnimatePresence` needs `initial={false}` to skip entry animation on first mount
- Variants defined outside components to avoid recreation on every render

### Solo Guide name lookup
- Scales: key = full name e.g. `"Major"`, `"Natural Minor"`
- Modes: strip suffix — `"Dorian (Mode II)"` becomes `"Dorian"`
- Code: `pattern.name.replace(/ \(Mode [IVX]+\)/, '').trim()`

### useFretboardDraw
- Does NOT accept `noteNames` as parameter — imports `NOTES` directly from theory.ts
- `numFrets` comes through `renderData` from `useFretboard` (reads from store)
- Do not add `noteNames` to useMemo dependency array

### CSS custom properties in Tailwind
- `var(--foo)` cannot be used inside Tailwind's `hover:` prefix
- Solution: custom utility classes in `@layer utilities` block in index.css
- OR use inline `style={{}}` with `onMouseEnter`/`onMouseLeave`

### SVG sizing
- viewBox and width/height attributes are independent
- `width="100%"` scales to container width; height calculates from viewBox aspect ratio
- For fixed-height displays: constrain via `maxHeight` on container + `overflow: hidden`
- For aspect ratio control: adjust viewBox dimensions, NOT the container CSS

---

## 14. What Is Done vs What's Next

### Fully Complete
- All theory data (scales, modes, triads, 7ths, tunings, solo guides)
- useTheoryStore, useUIStore with all actions
- Fretboard SVG renderer with animated dots, glow rings, chord-quality colouring
- Fret slider (12-24 frets) in ControlsRow
- SoloGuide 2-column layout with bar chart
- InfoBar with stagger animation + diatonic chord legend
- ChordGrid with card deal animation
- TopBar layout (Header + KeyRow + ControlsRow)
- Design token system in index.css + colors.ts
- Google Fonts integration
- Diatonic triad mode with chord quality colours and glow rings
- String set filter for diatonic view
- Category/Pattern dropdown linking
- 49 tests passing
- Vercel deployment with auto-deploy

### Written but needs verification
- `src/data/quizData.ts` — generateQuestion(), shouldLevelUp(), CHORD_SCALE_ENTRIES
- `src/stores/useQuizStore.ts` — persist middleware, startSession, submitAnswer
- `src/tests/quizData.test.ts` — test suite for quiz data

### Not yet built — Next: Phase 3b Artist Feature
1. Create `src/data/artistProfiles.ts` with 8 hardcoded profiles
   (BB King, Clapton, Gilmour, Santana, Hendrix, Mayer, Slash, Satriani)
2. Extend `useUIStore` with `selectedArtist`, `artistTabOpen` state
3. Add Artist tab inside Solo Guide (alongside existing content)
4. Build dropdown + custom search UI
5. Claude API integration for unknown artists (dynamic profile generation)
6. Fretboard auto-load artist's primary scale/mode when selected

### After Artist — Phase 3c Quiz Engine
1. Verify quiz data and store tests pass
2. Install React Router, create `src/pages/` folder
3. Build Quiz components (QuizPanel, QuizQuestion, QuizFeedback, QuizProgress)
4. Wire QuizPage at `/quiz` route
5. Add 'arpeggios' to Category type and PATTERNS_BY_CATEGORY
6. Add ARPEGGIO_PATTERNS to scales.ts

---

## 15. Future API Research

When ready to add song references to scales/modes:
- Hooktheory API — chord progressions to real songs
- Spotify API — audio features, genres, metadata
- Songsterr API — guitar tabs and chords by song

---

## 16. Architecture Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React + TypeScript strict | Type safety across complex music theory data |
| State | Zustand | No boilerplate, selective re-renders, persist middleware |
| Animation | Framer Motion | Layout animations, enter/exit, gesture props |
| Fretboard now | SVG | Debuggable, correct, good enough for Phase 1-3 |
| Fretboard Phase 4+ | PixiJS WebGL | 60fps needed for audio input visual feedback |
| Design system | CSS custom properties + Tailwind v4 bridge | Single source of truth, easy theme changes |
| Colour system | Per-interval unique colours | Learners visually identify any interval |
| Layout | Top bar (no sidebar) | More vertical space for fretboard, DAW-like feel |
| Routing | React Router v6 (not yet installed) | Deferred until quiz engine work begins |
| Pitch detection | Pitchy browser | MPM algorithm, <50ms, no backend required |
| Chord detection | FastAPI Python | librosa FFT more capable than JS alternatives |
| Hosting | Vercel | Auto-deploy from GitHub, free tier |
| Fonts | Playfair Display + DM Sans + DM Mono | Professional music software aesthetic |

---

*Fretboard Theory — Context Document v4.0 — April 2026*
*Next session: Build Phase 3b Artist Feature — Solo Guide Artist tab with Claude API*