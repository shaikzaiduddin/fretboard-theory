import { useMemo } from 'react'
import { useTheoryStore } from '../stores/useTheoryStore'
import { buildNoteSet, buildIntervalMap } from '../data/theory'
import { DIATONIC_QUALITIES, MAJOR_SCALE_INTERVALS } from '../data/scales'

export const MAX_FRETS  = 24
export const MIN_FRETS  = 12
export const FRET_DOTS  = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]
export const DOT_RADIUS = 6

const CHORD_QUALITY_COLORS: Record<string, string> = {
  maj: '#e8b931',
  min: '#4ade80',
  dim: '#f87171',
  aug: '#a78bfa',
}

export interface IntervalMapValue {
  interval:       number
  degree:         string
  colorOverride?: string
  isChordRoot?:   boolean
}

export interface FretboardRenderData {
  noteSet:       Set<number>
  intervalMap:   Record<number, IntervalMapValue>
  dimmedStrings: Set<number>
  stringCount:   number
  tuning:        number[]
  numFrets:      number
}

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
      const intervalMap: Record<number, IntervalMapValue> = {}

      // Pass 1: chord roots.
      // interval = semitones from the key tonic, not from the chord root.
      // isChordRoot: true flags this note for glow ring rendering.
      DIATONIC_QUALITIES.forEach((q, di) => {
        const chordRoot  = (root + MAJOR_SCALE_INTERVALS[di]) % 12
        const chordColor = CHORD_QUALITY_COLORS[q.type] ?? '#9ca3af'
        noteSet.add(chordRoot)
        intervalMap[chordRoot] = {
          interval:      MAJOR_SCALE_INTERVALS[di],
          degree:        q.degree,
          colorOverride: chordColor,
          isChordRoot:   true,
        }
      })

      // Pass 2: thirds and fifths (only if not already claimed as a root).
      // In practice, all 7 major scale notes ARE roots of diatonic chords,
      // so this pass mainly handles edge cases in non-major contexts.
      DIATONIC_QUALITIES.forEach((q, di) => {
        const chordRoot  = (root + MAJOR_SCALE_INTERVALS[di]) % 12
        const chordColor = CHORD_QUALITY_COLORS[q.type] ?? '#9ca3af'
        q.intervals.slice(1).forEach(iv => {
          const noteIdx           = (chordRoot + iv) % 12
          const intervalFromTonic = (MAJOR_SCALE_INTERVALS[di] + iv) % 12
          noteSet.add(noteIdx)
          if (!(noteIdx in intervalMap)) {
            intervalMap[noteIdx] = {
              interval:      intervalFromTonic,
              degree:        q.degree,
              colorOverride: chordColor,
              isChordRoot:   false,
            }
          }
        })
      })

      return { noteSet, intervalMap }
    }

    return {
      noteSet:     buildNoteSet(root, pattern.intervals),
      intervalMap: buildIntervalMap(root, pattern.intervals, pattern.degrees) as Record<number, IntervalMapValue>,
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

  return { noteSet, intervalMap, dimmedStrings, stringCount, tuning, numFrets }
}