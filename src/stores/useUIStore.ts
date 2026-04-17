import { create } from 'zustand'

// UI state = anything that affects appearance but not music theory.

interface UIState {
  soloGuideOpen:   boolean
  uploadPanelOpen: boolean

  lessonTab: 'overview' | 'techniques' | 'theory' | 'tips'

  triadModeVisible: boolean

  // Fretboard orientation preference.
  // false (default) = standard: high E on top, low E on bottom.
  //                   Matches tablature, Ultimate Guitar, most learning resources.
  // true            = inverted / "playing position": low E on top.
  //                   Mirrors what a guitarist sees looking down at their own neck.
  fretboardFlipped: boolean

  toggleSoloGuide:     () => void
  toggleUploadPanel:   () => void
  setLessonTab:        (tab: UIState['lessonTab']) => void
  setTriadModeVisible: (visible: boolean) => void
  toggleFretboardFlip: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  soloGuideOpen:    false,
  uploadPanelOpen:  false,
  lessonTab:        'overview',
  triadModeVisible: false,
  fretboardFlipped: false,

  toggleSoloGuide:   () => set({ soloGuideOpen: !get().soloGuideOpen }),
  toggleUploadPanel: () => set({ uploadPanelOpen: !get().uploadPanelOpen }),

  setLessonTab:        (lessonTab)        => set({ lessonTab }),
  setTriadModeVisible: (triadModeVisible) => set({ triadModeVisible }),

  toggleFretboardFlip: () => set({ fretboardFlipped: !get().fretboardFlipped }),
}))