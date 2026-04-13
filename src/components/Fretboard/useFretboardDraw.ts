import { useMemo } from 'react'
import { ROLE_COLORS } from '../../data/theory'
import { FRET_DOTS, DOT_RADIUS } from '../../hooks/useFretboard'
import type { FretboardRenderData } from '../../hooks/useFretboard'

// ─── LAYOUT CONSTANTS ─────────────────────────────────────────────────────────
const FB_LEFT   = 46    // left edge — label sits here, dot to its right
const FB_TOP    = 28
const FB_WIDTH  = 800
const FB_HEIGHT = 195

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getFretWidth(numFrets: number): number {
  // Fret width shrinks as you add more frets to keep total width constant
  return (FB_WIDTH - FB_LEFT) / numFrets
}

function getStringGap(stringCount: number): number {
  return stringCount > 1 ? FB_HEIGHT / (stringCount - 1) : FB_HEIGHT
}

function getStringY(stringIdx: number, stringCount: number): number {
  return stringCount === 1
    ? FB_TOP + FB_HEIGHT / 2
    : FB_TOP + stringIdx * getStringGap(stringCount)
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface StringRenderData {
  idx:       number
  y:         number
  thickness: number
  dimmed:    boolean
  label:     string
  openDot:   DotRenderData | null
  dots:      DotRenderData[]
}

export interface DotRenderData {
  x:      number
  y:      number
  color:  string
  isRoot: boolean
  label:  string
}

export interface FretboardDrawData {
  viewBox:    string
  strings:    StringRenderData[]
  fretLines:  { x: number; isNut: boolean }[]
  fretLabels: { x: number; label: string }[]
  inlayDots:  { x: number; y: number; double: boolean }[]
  boardRect:  { x: number; y: number; width: number; height: number }
  nutRect:    { x: number; y: number; width: number; height: number }
  labelX:     number   // x position for string name labels
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────
export function useFretboardDraw(
  renderData: FretboardRenderData,
  labelMode:  'note' | 'interval' | 'none',
  noteNames:  string[],
  root:       number,
): FretboardDrawData {

  const { noteSet, intervalMap, dimmedStrings, stringCount, tuning, numFrets } = renderData

  return useMemo(() => {
    const fretW       = getFretWidth(numFrets)
    const totalHeight = FB_TOP + FB_HEIGHT + 40
    const boardWidth  = FB_WIDTH - FB_LEFT

    // String name label sits at FB_LEFT - 14 (left of nut, right of edge)
    // Open string dot (when in scale) sits at FB_LEFT - 28
    // This gives: label at -14, dot at -28, no overlap
    const labelX   = FB_LEFT - 14
    const openDotX = FB_LEFT - 28

    // ── Fret lines ──────────────────────────────────────────────────────────
    const fretLines = Array.from({ length: numFrets + 1 }, (_, f) => ({
      x:     FB_LEFT + f * fretW,
      isNut: f === 0,
    }))

    // ── Fret number labels ──────────────────────────────────────────────────
    const fretLabels = Array.from({ length: numFrets }, (_, f) => ({
      x:     FB_LEFT + (f + 0.5) * fretW,
      label: String(f + 1),
    }))

    // ── Inlay dots ──────────────────────────────────────────────────────────
    const inlayDots = FRET_DOTS
      .filter(f => f <= numFrets)
      .map(f => ({
        x:      FB_LEFT + (f - 0.5) * fretW,
        y:      FB_TOP + FB_HEIGHT / 2,
        double: f === 12,
      }))

    // ── Strings + dots ───────────────────────────────────────────────────────
    const strings: StringRenderData[] = Array.from(
      { length: stringCount },
      (_, s) => {
        const y         = getStringY(s, stringCount)
        const dimmed    = dimmedStrings.has(s)
        const thickness = 0.5 + (stringCount - 1 - s) * (1.4 / Math.max(stringCount - 1, 1))

        const openSemitone = ((tuning[s] % 12) + 12) % 12
        const label        = noteNames[openSemitone]

        // Open string dot — sits clearly left of the label
        let openDot: DotRenderData | null = null
        if (!dimmed && noteSet.has(openSemitone)) {
          openDot = buildDot(
            openDotX, y,
            intervalMap[openSemitone],
            labelMode, noteNames, root
          )
        }

        // Fretted dots
        const dots: DotRenderData[] = []
        if (!dimmed) {
          for (let f = 1; f <= numFrets; f++) {
            const noteSemitone = ((tuning[s] + f) % 12 + 12) % 12
            if (noteSet.has(noteSemitone)) {
              dots.push(buildDot(
                FB_LEFT + (f - 0.5) * fretW, y,
                intervalMap[noteSemitone],
                labelMode, noteNames, root
              ))
            }
          }
        }

        return { idx: s, y, thickness, dimmed, label, openDot, dots }
      }
    )

    return {
      viewBox:   `0 0 ${FB_WIDTH + 20} ${totalHeight}`,
      strings,
      fretLines,
      fretLabels,
      inlayDots,
      boardRect: { x: FB_LEFT, y: FB_TOP, width: boardWidth, height: FB_HEIGHT },
      nutRect:   { x: FB_LEFT, y: FB_TOP - 4, width: 7, height: FB_HEIGHT + 8 },
      labelX,
    }
  }, [noteSet, intervalMap, dimmedStrings, stringCount, tuning, labelMode, root, numFrets])
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