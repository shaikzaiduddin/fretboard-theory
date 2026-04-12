import { create } from 'zustand'

// UI state is everything that affects appearance but not
// music theory calculations. Keeping it separate from
// useTheoryStore means:
//   - Opening the solo guide panel doesn't re-render the fretboard
//   - Changing the theme doesn't re-render the key grid
//   - Each component subscribes only to what it needs
//
// This is the performance benefit of splitting stores.
// Zustand only re-renders a component when the specific
// slice of state that component subscribed to changes.

interface UIState {
  // Panel visibility
  soloGuideOpen:   boolean
  uploadPanelOpen: boolean

  // Theme
  theme: 'dark' | 'light'

  // Active lesson tab in the tab player
  lessonTab: 'overview' | 'techniques' | 'theory' | 'tips'

  // Triad mode box visibility (shown only when category = triads)
  triadModeVisible: boolean

  // Actions
  toggleSoloGuide:   () => void
  toggleUploadPanel: () => void
  toggleTheme:       () => void
  setLessonTab:      (tab: UIState['lessonTab']) => void
  setTriadModeVisible: (visible: boolean) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  soloGuideOpen:    false,
  uploadPanelOpen:  false,
  theme:            'dark',
  lessonTab:        'overview',
  triadModeVisible: false,

  toggleSoloGuide: () =>
    set({ soloGuideOpen: !get().soloGuideOpen }),

  toggleUploadPanel: () =>
    set({ uploadPanelOpen: !get().uploadPanelOpen }),

  // Toggle between dark and light.
  // Also updates the html element's data-theme attribute so
  // CSS variables switch globally. You'll wire this up in main.tsx later.
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme: next })
    document.documentElement.setAttribute('data-theme', next)
  },

  setLessonTab: (lessonTab) => set({ lessonTab }),

  setTriadModeVisible: (triadModeVisible) => set({ triadModeVisible }),
}))