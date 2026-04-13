import { useMemo } from 'react'
import { useTheoryStore } from '../stores/useTheoryStore'
import { buildNoteSet, buildIntervalMap } from '../data/theory'
import { DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS } from '../data/scales'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
// NUM_FRETS is now a default — actual value comes from the store.
// FRET_DOTS lists the standard inlay positions on a guitar neck.
// DOT_RADIUS reduced to 9 — less crowded, more elegant.
export const MAX_FRETS  = 24
export const MIN_FRETS  = 12
export const FRET_DOTS  = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]
export const DOT_RADIUS = 8

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface FretboardRenderData {
  noteSet:       Set<number>
  intervalMap:   Record<number, { interval: number; degree: string }>
  dimmedStrings: Set<number>
  stringCount:   number
  tuning:        number[]
  numFrets:      number
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useFretboard(): FretboardRenderData {
  const {
    root,
    category,
    stringCount,
    tuning,
    triadMode,
    stringSet,
    numFrets,
    getCurrentPattern,
  } = useTheoryStore()

  const pattern = getCurrentPattern()

  const { noteSet, intervalMap } = useMemo(() => {
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

    return {
      noteSet:     buildNoteSet(root, pattern.intervals),
      intervalMap: buildIntervalMap(root, pattern.intervals, pattern.degrees),
    }
  }, [root, category, triadMode, pattern])

  const dimmedStrings = useMemo(() => {
    const dimmed = new Set<number>()

    if (category === 'triads' && triadMode === 'diatonic' && stringSet !== 'all') {
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
    numFrets,
  }
}