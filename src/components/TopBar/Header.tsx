// Header is the top bar of the application.

import { useState } from 'react'

export function Header() {
  
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore')

  return (
    <header className="h-[56px] w-full bg-[#080706] border-b flex items-center justify-between px-6">

      {/* Left: App identity */}
      <div className="flex items-center gap-4">
        {/* Playfair Display (font-serif) gives the title weight and musical character */}
        <h1 className="font-serif text-2xl font-bold text-[#f5f1e8] tracking-tight">
          Fretboard Theory
        </h1>

        {/* Badge — small, monospace, uppercase. Communicates app purpose at a glance */}
        <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.15em]
                         bg-gradient-to-b from-[#1a1816] to-[#141210]
                         text-[#8a7a68] rounded-md border shadow-sm">
          Guitar Explorer
        </span>
      </div>

      {/* Right: Navigation */}
      {/* Pill-shaped nav container — dark inset surface */}
      <nav className="flex items-center gap-1 bg-[#12100e] p-1 rounded-lg border">
        {(['explore', 'quiz'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 capitalize',
              activeTab === tab
                ? [
                    'bg-gradient-to-b from-[#f0c840] to-[#d4a420]',
                    'text-[#0f0e0c]',
                    'shadow-[0_2px_8px_rgba(232,185,49,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]',
                  ].join(' ')
                : 'text-[#8a7a68] hover:text-[#f0ece4] hover:bg-[#1a1816]',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </nav>

    </header>
  )
}