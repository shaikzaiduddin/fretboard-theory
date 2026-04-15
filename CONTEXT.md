# Fretboard Theory — Project Context & Handoff Document

> **Purpose:** This document provides complete context for the Fretboard Theory project. Attach it to any AI model or new chat to resume work without losing context. It covers what the app is, what has been built, what the tech stack is, what decisions were made, and exactly where development is up to.

> **Version:** 2.0 — Updated after Phase 2 completion (April 2026)

---

## 1. What Is This Project?

**Fretboard Theory** is an interactive guitar music theory learning web application. It is a personal portfolio project being built by Zaid, following industry-standard SDLC practices.

### Vision
> "An intelligent guitar learning companion that makes music theory visual, interactive, and personal — from your first scale to your first improvised solo."

### Current State
The project started as a single-file HTML/CSS/JavaScript prototype (v3, fully working), was migrated to a production-grade React + TypeScript + Vite application in Phase 1, and has completed Phase 2 which added animations, visual polish, and the fret count slider.

### Long-Term Roadmap
- **Phase 1** — Migrate HTML prototype to React + TypeScript ✅ Complete
- **Phase 2** — Visual polish, animations, fret slider ✅ Complete
- **Phase 3** — Real-time audio input, pitch detection (guitar → audio interface → browser) ⬜ Next
- **Phase 4** — Quiz engine (random progressions, play and be evaluated) ⬜ Planned
- **Phase 5** — Python FastAPI backend, chord detection via librosa FFT ⬜ Planned
- **Phase 6** — AI practice companion (LLM integration) ⬜ Planned

---

## 2. Repository & Hosting

| Item | Detail |
|------|--------|
| GitHub repo | `https://github.com/shaikzaiduddin/fretboard-theory` |
| Local path | `~/Projects/fretboard-theory` |
| Hosting | Vercel (auto-deploys on every push to `main`) |
| Dev server | `npm run dev` → `http://localhost:5173` |

---

## 3. Tech Stack

| Concern | Technology | Why |
|---------|-----------|-----|
| UI framework | React 18 + TypeScript | Scale, ecosystem, type safety |
| Build tool | Vite 5 | Fast dev server, HMR, production bundling |
| Styling | Tailwind CSS v4 | Utility-first, configured as Vite plugin |
| State management | Zustand | Simple, scalable, no boilerplate |
| Animation | Framer Motion | Enter/exit animations, layout animations, gesture feedback |
| Physics animation | React Spring | Installed, reserved for Phase 3 fretboard upgrade |
| Fretboard renderer | SVG (current), PixiJS WebGL (Phase 3) | SVG now for correctness, WebGL later for 60fps |
| Pitch detection (Phase 3) | Pitchy (MPM algorithm) | Low latency, accurate, browser-native |
| Backend (Phase 5) | FastAPI Python | WebSocket, librosa chord detection |
| Testing | Vitest + React Testing Library | Unit + component tests |
| CI/CD | GitHub Actions → Vercel | Auto-deploy on push |

### Important Tailwind v4 Note
Tailwind v4 does NOT use a config file or `tailwindcss init` command. It is configured as a Vite plugin:

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ...
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### Vitest Config Note
Must import `defineConfig` from `vitest/config`, NOT from `vite`:

```ts
import { defineConfig } from 'vitest/config'  // ← correct
```

### Framer Motion Patterns Used
- `motion.g` with `initial/animate/exit` — fretboard dot enter/exit animations
- `AnimatePresence` with `mode="wait"` — InfoBar pills, chord grid
- `motion.div` with `height: 0 → 'auto'` — SoloGuide accordion
- `layoutId` — category tab sliding indicator
- `whileTap` + `whileHover` with spring — key grid and pattern list buttons
- **Variants with staggerChildren** — InfoBar pills and chord cards stagger in left to right
- **Key prop pattern** — changing `key` on AnimatePresence children triggers exit/enter cycle

---

## 4. Project File Structure

```
fretboard-theory/
├── src/
│   ├── components/
│   │   ├── Fretboard/
│   │   │   ├── FretboardCanvas.tsx      ← SVG fretboard renderer + Framer Motion dot animations
│   │   │   └── useFretboardDraw.ts      ← coordinate maths hook (no noteNames param — uses NOTES directly)
│   │   ├── Sidebar/
│   │   │   ├── KeyGrid.tsx              ← 12 root note buttons with spring press animation
│   │   │   ├── PatternList.tsx          ← scale/mode/chord selector with sliding tab indicator
│   │   │   └── StringConfig.tsx         ← 6/7/8 string + tuning presets + per-string dropdowns
│   │   ├── SoloGuide/
│   │   │   ├── SoloGuide.tsx            ← collapsible theory panel with accordion animation
│   │   │   └── StrengthMap.tsx          ← note strength bar chart
│   │   ├── InfoBar.tsx                  ← scale name + staggered note pills animation
│   │   └── ChordGrid.tsx               ← diatonic chord cards with stagger animation
│   ├── data/
│   │   ├── theory.ts                    ← NOTES, ROLE_COLORS, normalise(), noteName(), buildNoteSet(), buildIntervalMap()
│   │   ├── scales.ts                    ← SCALE_PATTERNS, TRIAD_PATTERNS, SEVENTH_PATTERNS, MODES_ONLY, DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS
│   │   ├── tunings.ts                   ← TUNING_PRESETS for 6/7/8 string (Standard, Drop D, Open G, DADGAD)
│   │   └── soloGuides.ts               ← SOLO_GUIDES keyed by scale name
│   ├── hooks/
│   │   └── useFretboard.ts             ← computes noteSet + intervalMap + dimmedStrings from store
│   ├── stores/
│   │   ├── useTheoryStore.ts           ← root, category, pattern, tuning, string count, numFrets
│   │   └── useUIStore.ts               ← soloGuideOpen, theme, lessonTab
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── theory.test.ts              ← 11 tests
│   │   ├── scales.test.ts              ← 9 tests
│   │   ├── tunings.test.ts             ← 8 tests
│   │   ├── soloGuides.test.ts          ← 5 tests
│   │   └── useTheoryStore.test.ts      ← 16 tests
│   ├── types/
│   │   └── index.ts                    ← NoteName, Category, LabelMode, StringCount, ScalePattern, SoloGuide, TuningPreset, FretboardNote
│   ├── App.tsx                          ← root component
│   ├── main.tsx
│   └── index.css                        ← @import "tailwindcss"
├── CONTEXT.md                           ← this file
├── README.md                            ← portfolio README with live demo link
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json                    ← strict: true, noUnusedLocals, noUnusedParameters
└── package.json
```

---

## 5. Key Data Structures

### ScalePattern (src/types/index.ts)
```ts
export interface ScalePattern {
  name:      string     // "Major", "Dorian (Mode II)"
  intervals: number[]   // semitone distances from root e.g. [0,2,4,5,7,9,11]
  steps:     string     // "W W H W W W H"
  degrees:   string[]   // ["R","2","3","4","5","6","7"]
  mode?:     boolean    // true for mode entries in scales list
}
```

### SoloGuide (src/types/index.ts)
```ts
export interface SoloGuide {
  s1: number[]   // anchor intervals — strongest landing notes
  s2: number[]   // colour intervals
  s3: number[]   // passing intervals
  av: number[]   // avoid intervals
  theory: string // HTML string with <strong> and <em> tags
  tip:    string // "Pro Move" HTML string
}
```

### TuningPreset (src/types/index.ts)
```ts
export interface TuningPreset {
  label:   string
  tunings: Record<StringCount, number[]>  // StringCount = 6 | 7 | 8
}
```

### Tuning representation
Tunings are stored as **semitone indices (0–11)**, not note names or Hz frequencies.
- Standard 6-string: `[4, 9, 2, 7, 11, 4]` = E A D G B e
- 7-string adds low B (11) at index 0
- 8-string adds low F# (6) at index 0

---

## 6. Core Theory Utilities (src/data/theory.ts)

```ts
export function normalise(n: number): number {
  return ((n % 12) + 12) % 12
}

export function noteName(root: number, interval: number): NoteName {
  return NOTES[normalise(root + interval)]
}

export function buildNoteSet(root: number, intervals: number[]): Set<number>

export function buildIntervalMap(root, intervals, degrees): Record<number, {...}>
```

---

## 7. Zustand Stores

### useTheoryStore
```ts
// State
root:        number       // 0-11
category:    Category     // 'scales' | 'triads' | 'seventh' | 'modes'
patternIdx:  number
labelMode:   LabelMode    // 'note' | 'interval' | 'none'
stringCount: StringCount  // 6 | 7 | 8
tuning:      number[]
tuningLabel: string
triadMode:   'single' | 'diatonic'
stringSet:   string
numFrets:    number       // default 12, min 12, max 24 — controlled by fret slider

// Key actions
setRoot(root)
setCategory(category)
setStringCount(count)
setStringByIdx(idx, semitone)
applyPreset(label, count)
setNumFrets(n)
getCurrentPattern()
```

### useUIStore
```ts
soloGuideOpen:   boolean
uploadPanelOpen: boolean
theme:           'dark' | 'light'
lessonTab:       'overview' | 'techniques' | 'theory' | 'tips'

toggleSoloGuide()
toggleUploadPanel()
toggleTheme()
setLessonTab(tab)
```

---

## 8. Fretboard Architecture

### Data flow
```
useTheoryStore (state)
      ↓
useFretboard (hook) → computes noteSet + intervalMap + dimmedStrings + numFrets
      ↓
useFretboardDraw (hook) → computes SVG coordinates, dot positions, string data
      ↓
FretboardCanvas (component) → renders SVG + Framer Motion animated dots
```

### Layout constants (useFretboardDraw.ts)
```ts
const FB_LEFT   = 46    // left margin — string labels sit at FB_LEFT - 10
const FB_TOP    = 28
const FB_WIDTH  = 800
const FB_HEIGHT = 195
// openDotX = FB_LEFT - 26  (open string dots, left of nut)
// labelX   = FB_LEFT - 10  (string name text labels)
```

### Dot radius
```ts
export const DOT_RADIUS = 8  // in src/hooks/useFretboard.ts
```

### Fret slider
- `numFrets` lives in `useTheoryStore`
- Default: 12, Min: 12, Max: 24
- `MIN_FRETS` and `MAX_FRETS` exported from `useFretboard.ts`
- `FRET_DOTS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]` — inlay positions

### Important: noteNames removed from useFretboardDraw
`useFretboardDraw` previously took `noteNames` as a parameter causing React
compiler warnings. It now imports `NOTES` directly from `theory.ts`.

```ts
// Correct signature
export function useFretboardDraw(
  renderData: FretboardRenderData,
  labelMode:  'note' | 'interval' | 'none',
  root:       number,
): FretboardDrawData
```

### Color coding
```ts
0:  '#c9a84c'  // root — gold
3:  '#7dc87a'  // minor 3rd — green
4:  '#7dc87a'  // major 3rd — green
6:  '#cc7a7a'  // diminished 5th — red
7:  '#cc7a7a'  // perfect 5th — red
10: '#b57acc'  // minor 7th — purple
11: '#b57acc'  // major 7th — purple
```

---

## 9. Animation System (Framer Motion)

### Patterns in use

**Dot animations (FretboardCanvas.tsx)**
```tsx
<motion.g
  initial={{ opacity: 0, scale: 0.4 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.3 }}
  transition={{ duration: 0.2, delay, ease: 'easeOut' }}
  style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
>
```

**Accordion panel (SoloGuide.tsx)**
```tsx
<AnimatePresence initial={false}>
  {sgOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
```

**Stagger variants (InfoBar.tsx, ChordGrid.tsx)**
```tsx
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, scale: 0.7, y: -4 },
  visible: { opacity: 1, scale: 1,   y:  0 },
}
```

**Sliding tab indicator (PatternList.tsx)**
```tsx
{cat === category && (
  <motion.div
    layoutId="categoryIndicator"
    className="absolute inset-0 bg-stone-700 rounded-md"
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
  />
)}
```

**Spring button press (KeyGrid.tsx)**
```tsx
<motion.button
  whileTap={{ scale: 0.88 }}
  whileHover={{ scale: 1.08 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

**Key prop pattern — triggers exit/enter cycle**
```tsx
// When key changes, React unmounts old component (triggering exit)
// and mounts new component (triggering enter)
<AnimatePresence mode="wait">
  <motion.div key={`${root}-${pattern.name}`}>
```

---

## 10. What Has Been Built

### Phase 1 — Foundation ✅ Complete
| File | Tests |
|------|-------|
| `src/types/index.ts` | Type-checked |
| `src/data/theory.ts` | 11 tests |
| `src/data/scales.ts` | 9 tests |
| `src/data/tunings.ts` | 8 tests |
| `src/data/soloGuides.ts` | 5 tests |
| `src/stores/useTheoryStore.ts` | 16 tests |
| `src/stores/useUIStore.ts` | — |
| `src/hooks/useFretboard.ts` | — |
| All components | — |

**Total: 49 tests passing**

### Phase 2 — Visual Polish & Animations ✅ Complete
- Framer Motion installed and integrated throughout
- Fretboard dot stagger animations (enter/exit)
- Solo Guide accordion animation
- Key grid spring press and hover
- Category tab sliding indicator (layoutId)
- Pattern list press feedback
- InfoBar pill stagger animations
- Chord grid card deal stagger
- Fret count slider (12–24 frets)
- Open string dot overlap fixed
- Wood grain fretboard background
- Root note double glow ring
- Dot radius reduced to 8 for better proportions

### Phase 3 — Audio Input ⬜ Next
- Web Audio API setup
- Pitchy pitch detection
- AudioMonitor component
- Real-time fretboard highlighting

---

## 11. What to Build Next (Phase 3)

### Goal
Connect a guitar via audio interface, detect single notes being played,
and highlight them on the fretboard in real time.

### Files to create
```
src/components/AudioMonitor/
├── AudioMonitor.tsx        ← UI: device picker, confidence meter, detected note display
└── useAudioInput.ts        ← Web Audio API hook: getUserMedia, AudioWorklet, Pitchy
```

### Store changes needed
Add to `useTheoryStore` or create new `useAudioStore`:
```ts
inputDevice:   string | null
streamActive:  boolean
detectedNote:  number | null   // semitone 0-11
confidence:    number          // 0-1
```

### Data flow for audio
```
Guitar → Audio Interface → Browser getUserMedia()
      → AudioContext → AudioWorkletNode
      → Pitchy PitchDetector → { pitch: Hz, clarity: float }
      → if clarity > 0.85: convert Hz to semitone → update store
      → Fretboard highlights detected note
      → SoloGuide shows whether note is Anchor/Colour/Avoid
```

### Key technical notes
- Use `AudioWorkletNode` not `ScriptProcessorNode` (deprecated)
- Pitchy MPM algorithm is more accurate than autocorrelation for guitar
- Target latency: < 50ms from note played to visual feedback
- Audio data must never leave the browser (privacy requirement)
- Hz to semitone: `Math.round(12 * Math.log2(hz / 440) + 69)` gives MIDI note, then `% 12` for semitone

---

## 12. Features the App Has

### Working features
- 12 root key selector with spring animations
- 30+ scale patterns including all 7 modes
- Triads, 7th chords, Key Triads view
- String subset filter for Key Triads
- 6/7/8 string guitar support
- 4 tuning presets + per-string custom tuning
- Fret count slider (12–24 frets)
- Note label modes: note name, interval degree, none
- Solo Guide with landing notes, strength map, theory, pro tip
- Diatonic chord grid with animated card entrance
- Animated fretboard dots with stagger
- Smooth panel animations throughout

### Features NOT yet built
- Audio input from guitar
- Real-time pitch detection
- Quiz engine
- AI practice companion

---

## 13. Development Workflow

### Daily commands
```bash
cd ~/Projects/fretboard-theory
npm run dev          # localhost:5173
npm test             # watch mode
npx tsc --noEmit     # type check
npm run build        # production build
```

### Git workflow
```bash
git add .
git commit -m "feat: description"
git push             # triggers Vercel auto-deploy
```

### Commit types
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance
- `refactor:` — restructure without new features
- `test:` — tests
- `docs:` — documentation

---

## 14. Known Patterns and Gotchas

### TypeScript
- `noUnusedLocals` — every import must be used
- Unused destructured values: use `([, value])` not `([_key, value])`
- Unused parameters: prefix with `_`

### Zustand testing
- Always reset store in `beforeEach` — stores are singletons
- Use `getState()` / `setState()` in tests, not the hook

### Framer Motion
- `transformOrigin` must be set on SVG `motion.g` elements or scale animates from SVG origin
- `AnimatePresence` requires `initial={false}` if you don't want entry animation on first mount
- `layoutId` elements must be in the same `LayoutGroup` if across different component trees
- Variants defined outside components avoid recreation on every render

### Solo guide name lookup
- Scales: key = full name e.g. `"Major"`
- Modes: strip suffix — `"Dorian (Mode II)"` → lookup as `"Dorian"`
- Pattern: `pattern.name.replace(/ \(Mode [IVX]+\)/, '').trim()`

### useFretboardDraw
- Does NOT take `noteNames` as parameter — imports `NOTES` directly
- `numFrets` comes from `renderData` which comes from `useFretboard` which reads from store
- `noteNames` must NOT be in the useMemo dependency array

---

## 15. Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React + TypeScript | Type safety, ecosystem |
| Fretboard | SVG now, PixiJS Phase 3 | SVG debuggable; WebGL for 60fps with audio |
| Animation | Framer Motion | Layout animations, enter/exit, gesture feedback |
| State | Zustand | No boilerplate, selective re-renders |
| Pitch detection | Pitchy (browser) | MPM algorithm, <50ms, no backend |
| Chord detection | FastAPI Python (Phase 5) | librosa FFT |
| Hosting | Vercel | Auto-deploy, free tier |

---

## 16. How to Resume in a New Chat

Paste this document and say:

> "I am building the Fretboard Theory app. This document has full context.
> I am currently at [describe current step]. Help me continue."

---

*Updated April 2026 — Phase 2 Complete, Phase 3 Next*