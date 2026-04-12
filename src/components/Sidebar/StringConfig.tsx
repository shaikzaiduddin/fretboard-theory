// StringConfig lets the user:
//   1. Switch between 6, 7, and 8 string guitar
//   2. Choose a tuning preset (Standard, Drop D, etc.)
//   3. Fine-tune each individual string via a dropdown
//
// This component is a good example of a component that has
// multiple interactions that all update the same store.
// Notice how each interaction calls a specific store action —
// the component never directly manipulates state.

import { useTheoryStore } from '../../stores/useTheoryStore'
import { TUNING_PRESETS } from '../../data/tunings'
import { NOTES } from '../../data/theory'
import type { StringCount } from '../../types'

const STRING_COUNTS: StringCount[] = [6, 7, 8]

export function StringConfig() {
  const stringCount  = useTheoryStore(s => s.stringCount)
  const tuning       = useTheoryStore(s => s.tuning)
  const tuningLabel  = useTheoryStore(s => s.tuningLabel)
  const setStringCount  = useTheoryStore(s => s.setStringCount)
  const setStringByIdx  = useTheoryStore(s => s.setStringByIdx)
  const applyPreset     = useTheoryStore(s => s.applyPreset)

  return (
    <div className="flex flex-col gap-3">

      {/* String count toggle */}
      <div>
        <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
          Strings
        </span>
        <div className="flex gap-1">
          {STRING_COUNTS.map(count => (
            <button
              key={count}
              onClick={() => setStringCount(count)}
              className={`
                flex-1 py-1.5 font-mono text-xs rounded-md border
                transition-all duration-100
                ${count === stringCount
                  ? 'bg-amber-500 border-amber-500 text-stone-900 font-medium'
                  : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
                }
              `}
            >
              {count}-str
            </button>
          ))}
        </div>
      </div>

      {/* Tuning presets */}
      <div>
        <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
          Tuning Preset
        </span>
        <div className="flex flex-wrap gap-1">
          {TUNING_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.label, stringCount)}
              className={`
                px-2 py-1 font-mono text-xs rounded-md border
                transition-all duration-100
                ${preset.label === tuningLabel
                  ? 'bg-stone-700 border-stone-500 text-stone-100'
                  : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
                }
              `}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Per-string tuning dropdowns */}
      <div>
        <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
          Custom Tuning
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {tuning.slice(0, stringCount).map((semitone, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-xs text-stone-600">
                S{i + 1}
              </span>
              <select
                value={semitone}
                onChange={e => setStringByIdx(i, parseInt(e.target.value))}
                className="bg-stone-800 border border-stone-700 text-stone-200 rounded px-1 py-0.5 font-mono text-xs w-10 cursor-pointer focus:outline-none focus:border-amber-500"
              >
                {NOTES.map((note, idx) => (
                  <option key={note} value={idx}>
                    {note}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}