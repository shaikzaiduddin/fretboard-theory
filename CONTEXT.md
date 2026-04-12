# Fretboard Theory — Project Context & Handoff Document

> **Purpose:** This document provides complete context for the Fretboard Theory project. Attach it to any AI model or new chat to resume work without losing context. It covers what the app is, what has been built, what the tech stack is, what decisions were made, and exactly where development is up to.

---

## 1. What Is This Project?

**Fretboard Theory** is an interactive guitar music theory learning web application. It is a personal portfolio project being built by Zaid, following industry-standard SDLC practices.

### Vision
> "An intelligent guitar learning companion that makes music theory visual, interactive, and personal — from your first scale to your first improvised solo."

### Current State
The project started as a single-file HTML/CSS/JavaScript prototype (v3, fully working) and is being migrated to a production-grade React + TypeScript + Vite application following proper software engineering practices.

### Long-Term Roadmap
- **Phase 1** — Migrate HTML prototype to React + TypeScript (IN PROGRESS)
- **Phase 2** — Visual polish, PixiJS WebGL fretboard, Framer Motion animations
- **Phase 3** — Real-time audio input, pitch detection (guitar → audio interface → browser)
- **Phase 4** — Quiz engine (random progressions, play and be evaluated)
- **Phase 5** — Python FastAPI backend, chord detection via librosa FFT
- **Phase 6** — AI practice companion (LLM integration for personalised feedback)

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
| Animation (future) | Framer Motion + React Spring | UI transitions + physics animations |
| Fretboard renderer (future) | PixiJS WebGL | 60fps animated fretboard |
| Pitch detection (Phase 3) | Pitchy (MPM algorithm) | Low latency, accurate |
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
import { defineConfig } from 'vite'            // ← causes type error
```

---

## 4. Project File Structure

```
fretboard-theory/
├── src/
│   ├── components/
│   │   ├── Fretboard/
│   │   │   ├── FretboardCanvas.tsx      ← SVG fretboard renderer
│   │   │   └── useFretboardDraw.ts      ← coordinate maths hook
│   │   ├── Sidebar/
│   │   │   ├── KeyGrid.tsx              ← 12 root note buttons
│   │   │   ├── PatternList.tsx          ← scale/mode/chord selector
│   │   │   └── StringConfig.tsx         ← 6/7/8 string + tuning
│   │   ├── SoloGuide/
│   │   │   ├── SoloGuide.tsx            ← collapsible theory panel
│   │   │   └── StrengthMap.tsx          ← note strength bar chart
│   │   ├── InfoBar.tsx                  ← scale name + note pills
│   │   └── ChordGrid.tsx               ← diatonic chord cards
│   ├── data/
│   │   ├── theory.ts                    ← NOTES, ROLE_COLORS, normalise(), noteName()
│   │   ├── scales.ts                    ← SCALE_PATTERNS, TRIAD_PATTERNS, SEVENTH_PATTERNS, MODES_ONLY, DIATONIC_QUALITIES
│   │   ├── tunings.ts                   ← TUNING_PRESETS (Standard, Drop D, Open G, DADGAD) for 6/7/8 string
│   │   └── soloGuides.ts               ← SOLO_GUIDES keyed by scale name
│   ├── hooks/
│   │   └── useFretboard.ts             ← computes noteSet + intervalMap from store
│   ├── stores/
│   │   ├── useTheoryStore.ts           ← root, category, pattern, tuning, string count
│   │   └── useUIStore.ts               ← soloGuideOpen, theme, lessonTab
│   ├── tests/
│   │   ├── setup.ts                    ← @testing-library/jest-dom
│   │   ├── theory.test.ts              ← 11 tests for normalise, noteName etc.
│   │   ├── scales.test.ts              ← 9 data integrity tests
│   │   ├── tunings.test.ts             ← 8 tests
│   │   ├── soloGuides.test.ts          ← 5 tests
│   │   └── useTheoryStore.test.ts      ← 16 store tests
│   ├── types/
│   │   └── index.ts                    ← NoteName, Category, LabelMode, StringCount, ScalePattern, SoloGuide, TuningPreset, FretboardNote
│   ├── App.tsx                          ← root component
│   ├── main.tsx                         ← React entry point
│   └── index.css                        ← @import "tailwindcss"
├── vite.config.ts
├── tsconfig.json                        ← references tsconfig.app.json + tsconfig.node.json
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
// Keeps any number within 0-11 range. Handles negatives correctly.
// JavaScript's % can return negative: -1 % 12 = -1. This fixes it.
export function normalise(n: number): number {
  return ((n % 12) + 12) % 12
}

// Returns note name for root + interval
export function noteName(root: number, interval: number): NoteName {
  return NOTES[normalise(root + interval)]
}

// Builds Set<number> of note indices for fretboard rendering
export function buildNoteSet(root: number, intervals: number[]): Set<number>

// Builds lookup map: noteIndex → { interval, degree }
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
tuning:      number[]     // semitone indices, length = stringCount
tuningLabel: string       // "Standard", "Drop D" etc.
triadMode:   'single' | 'diatonic'
stringSet:   string       // 'all' | '0-2' | '1-3' etc.

// Key actions
setRoot(root)
setCategory(category)    // also resets patternIdx to 0
setStringCount(count)    // also loads correct tuning for that count
setStringByIdx(idx, semitone)  // update one string without changing others
applyPreset(label, count)      // apply full tuning preset
getCurrentPattern()      // returns current ScalePattern
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

## 8. Music Theory Data

### Scales available (src/data/scales.ts)
Major, Natural Minor, Harmonic Minor, Melodic Minor, Pentatonic Major, Pentatonic Minor, Blues, Whole Tone, Diminished HW, Diminished WH

**Modes (flagged with `mode: true`):**
Ionian (Mode I), Dorian (Mode II), Phrygian (Mode III), Lydian (Mode IV), Mixolydian (Mode V), Aeolian (Mode VI), Locrian (Mode VII)

**Triads:** Major, Minor, Diminished, Augmented, Sus2, Sus4

**Seventh chords:** Major 7th, Dominant 7th, Minor 7th, Minor Maj7, Half Dim 7th, Diminished 7th, Augmented Maj7, Dom 7 Sus4

### PATTERNS_BY_CATEGORY lookup
```ts
export const PATTERNS_BY_CATEGORY = {
  scales:  SCALE_PATTERNS,   // includes modes with mode:true flag
  triads:  TRIAD_PATTERNS,
  seventh: SEVENTH_PATTERNS,
  modes:   MODES_ONLY,       // filtered from SCALE_PATTERNS where mode===true
}
```

### Diatonic Qualities (for chord grid and diatonic triad view)
```ts
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]

export const DIATONIC_QUALITIES = [
  { degree: 'I',    type: 'maj', intervals: [0, 4, 7] },
  { degree: 'ii',   type: 'min', intervals: [0, 3, 7] },
  { degree: 'iii',  type: 'min', intervals: [0, 3, 7] },
  { degree: 'IV',   type: 'maj', intervals: [0, 4, 7] },
  { degree: 'V',    type: 'dom', intervals: [0, 4, 7] },
  { degree: 'vi',   type: 'min', intervals: [0, 3, 7] },
  { degree: 'vii°', type: 'dim', intervals: [0, 3, 6] },
]
```

### Solo Guide keys
Solo guides are keyed by scale name. Mode entries strip the suffix:
- `"Dorian (Mode II)"` in SCALE_PATTERNS → looked up as `"Dorian"` in SOLO_GUIDES
- `"Major"` → `"Major"` (no change)

---

## 9. Fretboard Rendering

### Architecture
```
useTheoryStore (state)
      ↓
useFretboard (hook) → computes noteSet + intervalMap + dimmedStrings
      ↓
useFretboardDraw (hook) → computes SVG coordinates, dot data, string data
      ↓
FretboardCanvas (component) → renders SVG elements
```

### Coordinate system
- `FB_LEFT = 44` — left margin for string name labels
- `FB_TOP = 28` — top margin
- `FB_WIDTH = 790` — total width
- `FB_HEIGHT = 195` — string area height
- `FRET_WIDTH = (FB_WIDTH - FB_LEFT) / NUM_FRETS` — width of each fret
- Dot X position: `FB_LEFT + (fret - 0.5) * FRET_WIDTH` (centred between fret lines)
- Dot Y position: `FB_TOP + stringIndex * (FB_HEIGHT / (stringCount - 1))`

### Color coding
```ts
// src/data/theory.ts — ROLE_COLORS
0:  '#c9a84c'  // root — gold
3:  '#7dc87a'  // minor 3rd — green
4:  '#7dc87a'  // major 3rd — green
6:  '#cc7a7a'  // diminished 5th — red
7:  '#cc7a7a'  // perfect 5th — red
10: '#b57acc'  // minor 7th — purple
11: '#b57acc'  // major 7th — purple
```

---

## 10. What Has Been Built (Phase 1 Progress)

### ✅ Completed
| File | Status | Tests |
|------|--------|-------|
| `src/types/index.ts` | Complete | Type-checked |
| `src/data/theory.ts` | Complete | 11 tests passing |
| `src/data/scales.ts` | Complete | 9 tests passing |
| `src/data/tunings.ts` | Complete | 8 tests passing |
| `src/data/soloGuides.ts` | Complete | 5 tests passing |
| `src/stores/useTheoryStore.ts` | Complete | 16 tests passing |
| `src/stores/useUIStore.ts` | Complete | No tests yet |
| `src/hooks/useFretboard.ts` | Complete | No tests yet |
| `src/components/Sidebar/KeyGrid.tsx` | Complete | No tests yet |
| `src/components/Sidebar/PatternList.tsx` | Complete | No tests yet |
| `src/components/Sidebar/StringConfig.tsx` | Complete | No tests yet |
| `src/components/Fretboard/FretboardCanvas.tsx` | Complete | No tests yet |
| `src/components/Fretboard/useFretboardDraw.ts` | Complete | No tests yet |

### ⬜ In Progress (next steps)
| File | Status |
|------|--------|
| `src/components/InfoBar.tsx` | Code written, not yet verified |
| `src/components/SoloGuide/SoloGuide.tsx` | Code written, not yet verified |
| `src/components/SoloGuide/StrengthMap.tsx` | Code written, not yet verified |
| `src/components/ChordGrid.tsx` | Code written, not yet verified |
| `src/App.tsx` | Needs final wiring |

### Test summary
- **Total tests:** 49 passing, 0 failing
- **Test files:** theory, scales, tunings, soloGuides, useTheoryStore

---

## 11. What to Build Next (Immediate)

The next task is to create and wire up the remaining components. All code has been written but needs to be saved and verified:

### Files to create
```bash
touch src/components/InfoBar.tsx
mkdir -p src/components/SoloGuide
touch src/components/SoloGuide/SoloGuide.tsx
touch src/components/SoloGuide/StrengthMap.tsx
touch src/components/ChordGrid.tsx
```

### Then update App.tsx to import all components:
```tsx
import { InfoBar }    from './components/InfoBar'
import { SoloGuide }  from './components/SoloGuide/SoloGuide'
import { ChordGrid }  from './components/ChordGrid'
```

### Verification steps after each file
```bash
npx tsc --noEmit   # silence = no errors
npm test           # all 49+ tests green
npm run dev        # visual check at localhost:5173
```

---

## 12. Features the App Must Have (from BRD)

### Core features (all working in HTML prototype, being rebuilt in React)
- 12 root key selector buttons
- Scale patterns: Major, Natural Minor, Harmonic Minor, Melodic Minor, Pentatonic Major/Minor, Blues, Whole Tone, Diminished HW/WH
- All 7 modes with visual divider in sidebar
- Triad types: Major, Minor, Diminished, Augmented, Sus2, Sus4
- 7th chord types: 8 types
- Key Triads view: shows all diatonic triads for selected key
- String subset filter for Key Triads (Str 1-3, 2-4, 3-5, 4-6)
- 6/7/8 string guitar support
- 4 tuning presets: Standard, Drop D, Open G, DADGAD
- Per-string custom tuning dropdowns
- Dot label modes: Note name, Interval degree, None
- Solo Guide panel: anchor/colour/passing/avoid notes, strength bar chart, theory, pro tip
- Diatonic chord grid: 7 chords, click to jump to that triad
- Color coded dots by interval role

### Features NOT yet built (future phases)
- Audio input from guitar/audio interface
- Real-time pitch detection
- Quiz engine
- Tab player
- AI practice companion

---

## 13. Development Workflow

### Daily commands
```bash
cd ~/Projects/fretboard-theory
npm run dev          # start dev server at localhost:5173
npm test             # run tests in watch mode
npx tsc --noEmit     # type check only
npm run build        # production build check
```

### Git workflow
```bash
git add .
git commit -m "feat: description of what was built"
git push             # triggers Vercel auto-deploy
```

### Commit message convention (Conventional Commits)
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance, config
- `refactor:` — code change without new features
- `test:` — adding or fixing tests
- `docs:` — documentation

---

## 14. Known Issues & Decisions

### Tailwind v4 deprecations
- Use `shrink-0` not `flex-shrink-0`
- Use `grow` not `flex-grow`
- No config file needed — auto-detects source files

### TypeScript strict mode gotchas
- `noUnusedLocals` — every import must be used
- `noUnusedParameters` — every function parameter must be used
- For intentionally unused destructured values use `([, value])` not `([_key, value])`
- For intentionally unused parameters use `_paramName` prefix

### Zustand testing
- Stores are singletons — always reset in `beforeEach` when testing
- Use `useTheoryStore.getState()` and `useTheoryStore.setState()` in tests (not the hook)

### Solo guide name lookup
- Scales: key = full name e.g. `"Major"`, `"Natural Minor"`
- Modes: strip suffix e.g. `"Dorian (Mode II)"` → lookup as `"Dorian"`
- Pattern: `pattern.name.replace(/ \(Mode [IVX]+\)/, '').trim()`

---

## 15. Architecture Decisions (from BRD ADRs)

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React + TypeScript | Type safety, ecosystem, PixiJS integration |
| Fretboard renderer | SVG now, PixiJS Phase 2 | SVG is debuggable; PixiJS for 60fps animations |
| State | Zustand | No boilerplate, scalable, selective re-renders |
| Pitch detection | Pitchy (browser) | MPM algorithm, <50ms latency, no backend needed |
| Chord detection | FastAPI Python (Phase 5) | librosa FFT more accurate than JS alternatives |
| Hosting | Vercel | Auto-deploy from GitHub, free tier |

---

## 16. BRD Document

A full Business Requirements Document + Technical Requirements Document was generated as:
`FretboardTheory_BRD_TRD_v1.0.docx`

It covers:
- Business requirements BR-001 to BR-044
- Non-functional requirements (performance, accessibility, security)
- Full system architecture
- 4 Architecture Decision Records (ADRs)
- Phased roadmap (Phase 1-6)
- Risk register
- SDLC process and engineering practices

---

## 17. How to Resume in a New Chat

Paste this document and say:

> "I am building the Fretboard Theory app. This document has full context. I am currently at [describe current step]. Help me continue."

The AI will have everything it needs — the file structure, data shapes, tech stack decisions, what's been built, what's pending, and the architectural patterns being followed.

---

*Generated April 2026 — Fretboard Theory v1.0 Phase 1*
