import { useTheoryStore }       from '../../stores/useTheoryStore'
import { PATTERNS_BY_CATEGORY } from '../../data/scales'
import { TUNING_PRESETS }       from '../../data/tunings'
import { MIN_FRETS, MAX_FRETS } from '../../hooks/useFretboard'
import type { Category, StringCount, LabelMode } from '../../types'

// ── Option lists ──────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'scales',  label: 'Scales'  },
  { value: 'triads',  label: 'Triads'  },
  { value: 'seventh', label: '7ths'    },
  { value: 'modes',   label: 'Modes'   },
]

const LABEL_OPTIONS: { value: LabelMode; label: string }[] = [
  { value: 'note',     label: 'Note'     },
  { value: 'interval', label: 'Interval' },
  { value: 'none',     label: 'None'     },
]

const STRING_OPTIONS: { value: StringCount; label: string }[] = [
  { value: 6, label: '6-string' },
  { value: 7, label: '7-string' },
  { value: 8, label: '8-string' },
]

// String subset options for diatonic triad view.
// Values are 0-indexed string ranges that useFretboard uses to dim strings.
// Labels use 1-indexed naming (how guitarists think: string 1 = high e).
const STRING_SET_OPTIONS = [
  { value: 'all', label: 'All strings' },
  { value: '0-2', label: 'Str 1–3'    },
  { value: '1-3', label: 'Str 2–4'    },
  { value: '2-4', label: 'Str 3–5'    },
  { value: '3-5', label: 'Str 4–6'    },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="w-px h-7 shrink-0 mx-1"
      style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
    />
  )
}

function ControlGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col shrink-0">
      <span className="control-label">{label}</span>
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ControlsRow() {
  const category       = useTheoryStore(s => s.category)
  const patternIdx     = useTheoryStore(s => s.patternIdx)
  const labelMode      = useTheoryStore(s => s.labelMode)
  const stringCount    = useTheoryStore(s => s.stringCount)
  const tuningLabel    = useTheoryStore(s => s.tuningLabel)
  const numFrets       = useTheoryStore(s => s.numFrets)
  const triadMode      = useTheoryStore(s => s.triadMode)
  const stringSet      = useTheoryStore(s => s.stringSet)
  const setCategory    = useTheoryStore(s => s.setCategory)
  const setPatternIdx  = useTheoryStore(s => s.setPatternIdx)
  const setLabelMode   = useTheoryStore(s => s.setLabelMode)
  const setStringCount = useTheoryStore(s => s.setStringCount)
  const applyPreset    = useTheoryStore(s => s.applyPreset)
  const setNumFrets    = useTheoryStore(s => s.setNumFrets)
  const setTriadMode   = useTheoryStore(s => s.setTriadMode)
  const setStringSet   = useTheoryStore(s => s.setStringSet)

  // ── Pattern filtering ───────────────────────────────────────────────────────
  // PATTERNS_BY_CATEGORY['scales'] includes modes (mode:true flag).
  // We strip them from the scales dropdown — they belong in 'modes' category.
  // This is the UI concern; the store/fretboard data remains unchanged.
  const allPatterns = PATTERNS_BY_CATEGORY[category]
  const patterns = category === 'scales'
    ? allPatterns.filter(p => !p.mode)
    : allPatterns

  const currentPattern = patterns[patternIdx] ?? patterns[0]

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCat = e.target.value as Category
    setCategory(newCat)
    setPatternIdx(0)
    // Reset triad-specific state when leaving triads
    if (newCat !== 'triads') {
      setStringSet('all')
    }
  }

  function handlePatternChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = patterns.findIndex(p => p.name === e.target.value)
    if (idx !== -1) setPatternIdx(idx)
  }

  // Show triad controls only when category is triads
  const isTriads = category === 'triads'
  // Show string set filter only for diatonic triad view
  const showStringSet = isTriads && triadMode === 'diatonic'

  return (
    <div
      className="w-full shrink-0 border-b flex items-center px-4 gap-2 h-[56px]"
      style={{ backgroundColor: '#0c0b0a', borderColor: 'var(--border)' }}
    >
      {/* ── Group 1: Pattern selection ── */}
      <ControlGroup label="Category">
        <select
          className="control-select w-[110px]"
          value={category}
          onChange={handleCategoryChange}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </ControlGroup>

      <ControlGroup label="Pattern">
        <select
          className="control-select w-[180px]"
          value={currentPattern?.name ?? ''}
          onChange={handlePatternChange}
        >
          {patterns.map(p => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </ControlGroup>

      {/* ── Triad controls — only visible when category = triads ── */}
      {isTriads && (
        <>
          <Divider />

          {/* Single vs Diatonic toggle
              Single   = one chord shape (e.g. all C major triads on the neck)
              Diatonic = all 7 diatonic chord shapes for the selected key */}
          <ControlGroup label="Triad View">
            <div
              className="flex h-8 rounded-md overflow-hidden border"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {(['single', 'diatonic'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setTriadMode(mode)}
                  className="px-3 text-xs font-mono capitalize transition-colors duration-150"
                  style={
                    triadMode === mode
                      ? {
                          backgroundColor: 'var(--primary)',
                          color:           'var(--primary-foreground)',
                        }
                      : {
                          backgroundColor: '#161412',
                          color:           'var(--text-muted)',
                        }
                  }
                >
                  {mode}
                </button>
              ))}
            </div>
          </ControlGroup>

          {/* String set filter — only for diatonic view.
              Dims strings outside the selected subset so the player
              can focus on chord shapes on 3 adjacent strings at a time.
              This is how guitarists actually practice triads — one string
              group at a time, moving shapes up the neck. */}
          {showStringSet && (
            <ControlGroup label="String set">
              <select
                className="control-select w-[120px]"
                value={stringSet}
                onChange={e => setStringSet(e.target.value)}
              >
                {STRING_SET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </ControlGroup>
          )}
        </>
      )}

      <Divider />

      {/* ── Group 2: Label mode ── */}
      <ControlGroup label="Labels">
        <select
          className="control-select w-[110px]"
          value={labelMode}
          onChange={e => setLabelMode(e.target.value as LabelMode)}
        >
          {LABEL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </ControlGroup>

      <Divider />

      {/* ── Group 3: Guitar config ── */}
      <ControlGroup label="Strings">
        <select
          className="control-select w-[110px]"
          value={stringCount}
          onChange={e => setStringCount(Number(e.target.value) as StringCount)}
        >
          {STRING_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </ControlGroup>

      <ControlGroup label="Tuning">
        <select
          className="control-select w-[110px]"
          value={tuningLabel}
          onChange={e => applyPreset(e.target.value, stringCount)}
        >
          {TUNING_PRESETS.map(preset => (
            <option key={preset.label} value={preset.label}>
              {preset.label}
            </option>
          ))}
        </select>
      </ControlGroup>

      {/* ── Fret slider — pushed right ── */}
      <div className="flex items-end gap-3 ml-auto shrink-0">
        <ControlGroup label="Frets">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={MIN_FRETS}
              max={MAX_FRETS}
              step={1}
              value={numFrets}
              onChange={e => setNumFrets(Number(e.target.value))}
              className="w-28 cursor-pointer"
              style={{ accentColor: '#e8b931' }}
            />
            <span
              className="font-mono text-sm font-bold w-6 text-right tabular-nums"
              style={{ color: 'var(--primary)' }}
            >
              {numFrets}
            </span>
          </div>
        </ControlGroup>
      </div>

    </div>
  )
}