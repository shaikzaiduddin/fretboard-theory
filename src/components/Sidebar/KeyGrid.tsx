// KeyGrid renders 12 buttons — one for each chromatic note.
// When clicked, it updates the root in the theory store.
// Every other component that depends on root (fretboard,
// solo guide, chord grid) automatically re-renders because
// they subscribe to the same store.
//
// This component has zero logic of its own — it reads from
// the store, renders buttons, and calls store actions on click.
// That's what a well-designed component looks like.

import { useTheoryStore } from '../../stores/useTheoryStore'
import { NOTES } from '../../data/theory'

export function KeyGrid() {
  const root    = useTheoryStore(s => s.root)
  const setRoot = useTheoryStore(s => s.setRoot)

  // Why subscribe to root and setRoot separately instead of
  // const { root, setRoot } = useTheoryStore()?
  //
  // When you destructure the whole store, the component re-renders
  // whenever ANY store value changes — even ones you don't use.
  // Subscribing with a selector function (s => s.root) means this
  // component only re-renders when root specifically changes.
  // This is the correct Zustand usage pattern for performance.

  return (
    <div>
      <span className="block font-mono text-xs tracking-widest uppercase text-stone-500 mb-2">
        Root Key
      </span>
      <div className="grid grid-cols-6 gap-1">
        {NOTES.map((note, i) => (
          <button
            key={note}
            onClick={() => setRoot(i)}
            className={`
              rounded px-1 py-1.5 font-mono text-xs
              transition-all duration-100
              ${i === root
                ? 'bg-amber-500 text-stone-900 font-medium'
                : 'bg-stone-800 text-stone-400 border border-stone-700 hover:border-stone-500 hover:text-stone-200'
              }
            `}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  )
}