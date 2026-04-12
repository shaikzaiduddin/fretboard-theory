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

import { KeyGrid }      from './components/Sidebar/KeyGrid'
import { PatternList }  from './components/Sidebar/PatternList'
import { StringConfig } from './components/Sidebar/StringConfig'

function App() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">

      <header className="px-6 py-4 border-b border-stone-800 flex items-center gap-3 flex-shrink-0">
        <h1 className="font-serif text-2xl text-amber-300">
          Fretboard Theory
        </h1>
        <span className="font-mono text-xs text-stone-500 border border-stone-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Guitar Explorer
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 border-r border-stone-800 p-4 overflow-y-auto flex flex-col gap-5 flex-shrink-0">
          <KeyGrid />
          <PatternList />
          <StringConfig />
        </aside>

        <main className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          <div className="text-stone-500 text-xs font-mono">
            Fretboard coming soon
          </div>
        </main>

      </div>
    </div>
  )
}

export default App