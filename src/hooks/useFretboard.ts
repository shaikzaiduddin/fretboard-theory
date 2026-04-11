import { useMemo } from 'react'
import { useTheoryStore } from '../stores/useTheoryStore'
import { buildNoteSet, buildIntervalMap } from '../data/theory'
import { DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS } from '../data/scales'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const NUM_FRETS    = 15
export const FRET_DOTS    = [3, 5, 7, 9, 12, 15]
export const DOT_RADIUS   = 10

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface FretboardRenderData {
  noteSet:        Set<number>
  intervalMap:    Record<number, { interval: number; degree: string }>
  dimmedStrings:  Set<number>
  stringCount:    number
  tuning:         number[]
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
// useMemo is used throughout this hook to avoid recalculating
// expensive operations on every render. The dependency arrays
// tell React "only recalculate if these values changed."
//
// For example, buildNoteSet doesn't need to run again if the user
// just opened a panel — only if root or the pattern's intervals changed.
// Without useMemo, every render of every component that uses this
// hook would redo all this calculation. With useMemo, it only runs
// when the inputs actually change.

export function useFretboard(): FretboardRenderData {
  const {
    root,
    category,
    stringCount,
    tuning,
    triadMode,
    stringSet,
    getCurrentPattern,
  } = useTheoryStore()

  // Get the current pattern once — used in multiple calculations below
  const pattern = getCurrentPattern()

  // ── Note set and interval map ──────────────────────────────────────────────
  // These are the two core data structures the renderer needs:
  //   noteSet:     Set<number> — which note indices (0-11) to show dots for
  //   intervalMap: maps note index → { interval, degree } for color + label

  const { noteSet, intervalMap } = useMemo(() => {
    // Diatonic triads mode — show notes from all 7 diatonic triads
    if (category === 'triads' && triadMode === 'diatonic') {
      const noteSet    = new Set<number>()
      const intervalMap: Record<number, { interval: number; degree: string }> = {}

      DIATONIC_QUALITIES.forEach((q, di) => {
        const triadRoot = (root + MAJOR_SCALE_INTERVALS[di]) % 12
        q.intervals.forEach((iv) => {
          const noteIdx = (triadRoot + iv) % 12
          noteSet.add(noteIdx)
          if (!(noteIdx in intervalMap)) {
            intervalMap[noteIdx] = { interval: iv, degree: q.degree }
          }
        })
      })

      return { noteSet, intervalMap }
    }

    // All other modes — show notes from the selected pattern
    return {
      noteSet:     buildNoteSet(root, pattern.intervals),
      intervalMap: buildIntervalMap(root, pattern.intervals, pattern.degrees),
    }
  }, [root, category, triadMode, pattern])

  // ── Dimmed strings ─────────────────────────────────────────────────────────
  // In diatonic triads mode, unselected string subsets are dimmed.
  // A dimmed string still renders the string line but no dots,
  // and the line is visually faded.

  const dimmedStrings = useMemo(() => {
    const dimmed = new Set<number>()

    if (
      category === 'triads' &&
      triadMode === 'diatonic' &&
      stringSet !== 'all'
    ) {
      const [lo, hi] = stringSet.split('-').map(Number)
      for (let s = 0; s < stringCount; s++) {
        if (s < lo || s > hi) dimmed.add(s)
      }
    }

    return dimmed
  }, [category, triadMode, stringSet, stringCount])

  return {
    noteSet,
    intervalMap,
    dimmedStrings,
    stringCount,
    tuning,
  }
}