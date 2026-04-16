
import { Header }          from './components/TopBar/Header'
import { KeyRow }          from './components/TopBar/KeyRow'
import { ControlsRow }     from './components/TopBar/ControlsRow'
import { InfoBar }         from './components/InfoBar'
import { FretboardCanvas } from './components/Fretboard/FretboardCanvas'
import { ChordGrid }       from './components/ChordGrid'
import { SoloGuide }       from './components/SoloGuide/SoloGuide'

function App() {
  return (
    <div
      className="min-h-screen flex flex-col min-w-[1024px]"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* ── Top bar — fixed, never scrolls ───────────────────────────── */}
      <Header />
      <KeyRow />
      <ControlsRow />
      <InfoBar />

      {/* ── Fretboard — full width, no padding, fixed height ─────────── */}
      {/* No px-4 or py-3 here — the fretboard owns its own spacing.
          A thin border top/bottom separates it from the rows above/below. */}
      <div
        className="shrink-0 border-y"
        style={{ borderColor: 'var(--border)' }}
      >
        <FretboardCanvas />
      </div>

      {/* ── Below-fold content — scrolls if needed ───────────────────── */}
      <div className="flex flex-col flex-1">
        <ChordGrid />
        <div className="px-4 pb-4 pt-2">
          <SoloGuide />
        </div>
      </div>

    </div>
  )
}

export default App