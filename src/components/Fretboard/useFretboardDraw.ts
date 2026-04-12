import { useMemo } from 'react'
import { ROLE_COLORS } from '../../data/theory'
import { NUM_FRETS, FRET_DOTS } from '../../hooks/useFretboard'
import type { FretboardRenderData } from '../../hooks/useFretboard'

// ─── LAYOUT CONSTANTS ─────────────────────────────────────────────────────────
// These control the visual dimensions of the fretboard.
// All values are in SVG user units (effectively pixels at 1:1 scale).
const FB_LEFT   = 44    // left edge — space for string name labels
const FB_TOP    = 28    // top edge — space above first string
const FB_WIDTH  = 790   // total width including margins
const FB_HEIGHT = 195   // total height of string area

// ─── DERIVED LAYOUT ──────────────────────────────────────────────────────────
const FRET_WIDTH = (FB_WIDTH - FB_LEFT) / NUM_FRETS

function getStringGap(stringCount: number): number {
  // Distribute strings evenly across FB_HEIGHT.
  // With 1 string there's no gap — it sits in the middle.
  return stringCount > 1 ? FB_HEIGHT / (stringCount - 1) : FB_HEIGHT
}

function getStringY(stringIdx: number, stringCount: number): number {
  return stringCount === 1
    ? FB_TOP + FB_HEIGHT / 2
    : FB_TOP + stringIdx * getStringGap(stringCount)
}

function getFretX(fret: number): number {
  // Fret 0 is the nut (left edge).
  // A dot at fret F sits halfway between fret line F-1 and fret line F.
  return FB_LEFT + fret * FRET_WIDTH
}

function getDotX(fret: number): number {
  return FB_LEFT + (fret - 0.5) * FRET_WIDTH
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface StringRenderData {
  idx:        number
  y:          number
  thickness:  number
  dimmed:     boolean
  label:      string    // open string note name e.g. "E", "A"
  openDot:    DotRenderData | null
  dots:       DotRenderData[]
}

export interface DotRenderData {
  x:        number
  y:        number
  color:    string
  isRoot:   boolean
  label:    string    // note name or interval degree, based on labelMode
}

export interface FretboardDrawData {
  viewBox:    string
  strings:    StringRenderData[]
  fretLines:  { x: number; isNut: boolean }[]
  fretLabels: { x: number; label: string }[]
  inlayDots:  { x: number; y: number; double: boolean }[]
  boardRect: {
    x: number; y: number; width: number; height: number
  }
  nutRect: {
    x: number; y: number; width: number; height: number
  }
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────
export function useFretboardDraw(
  renderData: FretboardRenderData,
  labelMode:  'note' | 'interval' | 'none',
  noteNames:  string[],   // NOTES array — passed in to avoid import cycle
  root:       number,
): FretboardDrawData {

  const { noteSet, intervalMap, dimmedStrings, stringCount, tuning } = renderData

  return useMemo(() => {
    const totalHeight = FB_TOP + FB_HEIGHT + 40  // extra for fret numbers below

    // ── Fret lines ──────────────────────────────────────────────────────────
    const fretLines = Array.from({ length: NUM_FRETS + 1 }, (_, f) => ({
      x:     getFretX(f),
      isNut: f === 0,
    }))

    // ── Fret number labels ──────────────────────────────────────────────────
    const fretLabels = Array.from({ length: NUM_FRETS }, (_, f) => ({
      x:     FB_LEFT + (f + 0.5) * FRET_WIDTH,
      label: String(f + 1),
    }))

    // ── Inlay dots (fretboard position markers) ──────────────────────────────
    const inlayDots = FRET_DOTS
      .filter(f => f <= NUM_FRETS)
      .map(f => ({
        x:      FB_LEFT + (f - 0.5) * FRET_WIDTH,
        y:      FB_TOP + FB_HEIGHT / 2,
        double: f === 12,
      }))

    // ── Strings + dots ───────────────────────────────────────────────────────
    const strings: StringRenderData[] = Array.from(
      { length: stringCount },
      (_, s) => {
        const y       = getStringY(s, stringCount)
        const dimmed  = dimmedStrings.has(s)
        // Thickness increases from highest string to lowest
        // giving a visual cue that matches a real guitar
        const thickness = 0.6 + (stringCount - 1 - s) * (1.6 / Math.max(stringCount - 1, 1))

        // Open string note label
        const openSemitone = ((tuning[s] % 12) + 12) % 12
        const label = noteNames[openSemitone]

        // Open string dot (to the left of the nut)
        let openDot: DotRenderData | null = null
        if (!dimmed && noteSet.has(openSemitone)) {
          const info = intervalMap[openSemitone]
          openDot = buildDot(
            FB_LEFT - 20, y,
            info, labelMode, noteNames, root
          )
        }

        // Fretted dots
        const dots: DotRenderData[] = []
        if (!dimmed) {
          for (let f = 1; f <= NUM_FRETS; f++) {
            const noteSemitone = ((tuning[s] + f) % 12 + 12) % 12
            if (noteSet.has(noteSemitone)) {
              const info = intervalMap[noteSemitone]
              dots.push(buildDot(
                getDotX(f), y,
                info, labelMode, noteNames, root
              ))
            }
          }
        }

        return { idx: s, y, thickness, dimmed, label, openDot, dots }
      }
    )

    return {
      viewBox:    `0 0 840 ${totalHeight}`,
      strings,
      fretLines,
      fretLabels,
      inlayDots,
      boardRect:  { x: FB_LEFT, y: FB_TOP, width: FB_WIDTH - FB_LEFT, height: FB_HEIGHT },
      nutRect:    { x: FB_LEFT, y: FB_TOP - 4, width: 7, height: FB_HEIGHT + 8 },
    }
  }, [noteSet, intervalMap, dimmedStrings, stringCount, tuning, labelMode, root, noteNames])
}

// ─── HELPER ───────────────────────────────────────────────────────────────────
function buildDot(
  x:         number,
  y:         number,
  info:      { interval: number; degree: string } | undefined,
  labelMode: 'note' | 'interval' | 'none',
  noteNames: string[],
  root:      number,
): DotRenderData {
  const interval = info?.interval ?? 0
  const color    = ROLE_COLORS[interval] ?? '#5a9ecc'
  const isRoot   = interval === 0

  let label = ''
  if (labelMode === 'note') {
    label = noteNames[((root + interval) % 12 + 12) % 12]
  } else if (labelMode === 'interval') {
    label = info?.degree ?? ''
  }

  return { x, y, color, isRoot, label }
}