// App.tsx is the root component — the top of the component tree.
// Everything the user sees lives inside this component.
//
// Right now it's a shell with placeholder sections.
// As you build each component, you'll import it here and
// replace the placeholder <div> with the real component.
//
// This approach — build the skeleton first, fill in pieces —
// is called incremental development. The app is always in a
// runnable state, even when features are incomplete.

import { useTheoryStore }  from './stores/useTheoryStore'
import { KeyGrid }         from './components/Sidebar/KeyGrid'
import { PatternList }     from './components/Sidebar/PatternList'
import { StringConfig }    from './components/Sidebar/StringConfig'
import { FretboardCanvas } from './components/Fretboard/FretboardCanvas'
import { InfoBar }         from './components/InfoBar'
import { SoloGuide }       from './components/SoloGuide/SoloGuide'
import { ChordGrid }       from './components/ChordGrid'

const LABEL_OPTIONS = ['note', 'interval', 'none'] as const

function App() {
  const labelMode    = useTheoryStore(s => s.labelMode)
  const setLabelMode = useTheoryStore(s => s.setLabelMode)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">

      {/* Header */}
      <header className="px-6 py-4 border-b border-stone-800 flex items-center gap-3 shrink-0">
        <h1 className="font-serif text-2xl text-amber-300">
          Fretboard Theory
        </h1>
        <span className="font-mono text-xs text-stone-500 border border-stone-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Guitar Explorer
        </span>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 border-r border-stone-800 p-4 overflow-y-auto flex flex-col gap-5 shrink-0">
          <KeyGrid />
          <PatternList />
          <StringConfig />
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">

          {/* Info bar — scale name + note pills */}
          <InfoBar />

          {/* Label toggle */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
              Label
            </span>
            <div className="flex gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
              {LABEL_OPTIONS.map(mode => (
                <button
                  key={mode}
                  onClick={() => setLabelMode(mode)}
                  className={`
                    px-3 py-1 rounded-md text-xs capitalize transition-all duration-100
                    ${mode === labelMode
                      ? 'bg-stone-700 text-stone-100 border border-stone-600'
                      : 'text-stone-500 hover:text-stone-300'
                    }
                  `}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Fretboard */}
          <FretboardCanvas />

          {/* Solo Guide — only shown for scales/modes */}
          <SoloGuide />

          {/* Diatonic chord grid — only shown for scales/modes */}
          <ChordGrid />

        </main>
      </div>
    </div>
  )
}

export default App