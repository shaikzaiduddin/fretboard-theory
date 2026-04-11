import type { SoloGuide } from '../types'

// Solo guides are keyed by scale name (matching ScalePattern.name exactly).
// This is intentional — components look up the guide using the pattern name
// as the key, so the strings must match perfectly.
//
// Interval numbers refer to semitone distances from the root (0-11):
//   s1 = anchor notes   — strongest, always safe to land on
//   s2 = colour notes   — add character, use freely
//   s3 = passing notes  — use in motion, don't sit on them
//   av = avoid notes    — clash with underlying chord, use carefully
//
// Why store intervals instead of note names?
// Because the guide must work in any key. If you're in F# Dorian,
// the anchor note is still interval 0 (the root) — just a different
// pitch than C Dorian. Storing intervals makes the guide
// key-agnostic and automatically correct in every transposition.

export const SOLO_GUIDES: Record<string, SoloGuide> = {

  'Major': {
    s1: [0],
    s2: [4, 7],
    s3: [9, 11],
    av: [5],
    theory: 'The <strong>Major scale</strong> sits over Imaj7 chords. The <em>root (1)</em> is your strongest anchor — it resolves all tension. The <em>major 3rd</em> and <em>perfect 5th</em> form the major triad and are your consonant pillars. The <em>6th</em> and <em>7th</em> add warmth without instability. The <em>4th</em> is the classical avoid note over a maj7 chord — it clashes with the 3rd at a minor 9th interval. Use it only as a passing tone.',
    tip: '<strong>Pro move:</strong> The 7→1 resolution (leading tone to root) is one of the strongest melodic pulls in Western music. Build phrases that land there.',
  },

  'Natural Minor': {
    s1: [0],
    s2: [3, 7],
    s3: [8, 10],
    av: [],
    theory: 'The <strong>Natural Minor scale</strong> has a melancholic, dark character. The <em>root</em>, <em>minor 3rd</em> and <em>5th</em> form your home triad. The <em>♭6</em> and <em>♭7</em> are the notes that give minor its brooding quality. There are no strong avoid notes — all tones blend well over a minor chord, making this very forgiving for improvisers.',
    tip: '<strong>Pro move:</strong> Bend from the ♭3 toward the natural 3rd for an instant blues-inflected sound. The ♭6→5 descent creates a feeling of longing that defines minor key melodies.',
  },

  'Harmonic Minor': {
    s1: [0],
    s2: [3, 7],
    s3: [11],
    av: [8],
    theory: '<strong>Harmonic Minor</strong> raises the 7th a half-step, creating a true <em>leading tone</em> that powerfully resolves to the root. The augmented 2nd gap between ♭6 and 7 is its most recognisable feature — it gives the Spanish and neoclassical metal sound. The ♭6 creates intense tension; resolve it upward through the 7 to the root for maximum drama.',
    tip: '<strong>Pro move:</strong> The descending run 7–♭6–5 exploits the dramatic augmented 2nd and is the backbone of countless flamenco and metal phrases.',
  },

  'Melodic Minor': {
    s1: [0],
    s2: [3, 7],
    s3: [9, 11],
    av: [],
    theory: '<strong>Melodic Minor</strong> raises both the 6th and 7th from natural minor, smoothing the awkward augmented 2nd. It has a sophisticated, jazz-flavoured quality. The natural 6th and 7th make ascending lines feel elegant, while the ♭3 preserves the minor character.',
    tip: '<strong>Pro move:</strong> Over a min(maj7) chord, melodic minor is the theoretically correct choice — the natural 7th perfectly matches the chord tone.',
  },

  'Pentatonic Major': {
    s1: [0],
    s2: [4, 7],
    s3: [2, 9],
    av: [],
    theory: '<strong>Major Pentatonic</strong> removes the 4th and 7th — the two most tension-creating scale tones — leaving only consonant notes. This is why it works over virtually any chord in a major context. Every note is a safe landing spot. It is the foundation of country, gospel and pop lead playing.',
    tip: '<strong>Pro move:</strong> Slide into the 3rd from a half-step below. Phrases that begin on the 5th and resolve to the root sound instantly musical and complete.',
  },

  'Pentatonic Minor': {
    s1: [0],
    s2: [3, 7],
    s3: [5, 10],
    av: [],
    theory: 'The most widely used scale in rock, blues and pop. <strong>Minor Pentatonic</strong> removes the ♭2 and ♭6, keeping only the safest five notes. The ♭3 gives it a bluesy quality even over dominant 7 chords. The ♭7 adds swagger and unresolved energy. No note truly clashes, making this the ideal starting point for all improvisers.',
    tip: '<strong>Pro move:</strong> The ♭3–4–5 hammer-on run is one of the most iconic licks in rock. Combine with bends on the ♭3 to pitch it toward the major 3rd for instant blues feeling.',
  },

  'Blues': {
    s1: [0],
    s2: [3, 7],
    s3: [5, 10],
    av: [6],
    theory: '<strong>Blues Scale</strong> adds the ♭5 (blue note) to minor pentatonic. This note is deliberately dissonant — it exists to create tension before resolving to the 5 or 4. Never sit on the ♭5; always let it move. The emotional power of the blues comes from this tension-and-release.',
    tip: '<strong>Pro move:</strong> Bend the ♭5 up to the 5 — this single bend captures the entire emotional DNA of blues guitar. Or slide from ♭5 down to 4 for a darker resolution.',
  },

  'Whole Tone': {
    s1: [0],
    s2: [4, 8],
    s3: [2, 6],
    av: [],
    theory: 'The <strong>Whole Tone scale</strong> is perfectly symmetric — every step is a whole tone. This creates an ambiguous, floating, dreamlike quality with no strong gravitational pull. It works over augmented and dominant 7♯5 chords. Because of its symmetry, no note feels more resolved than any other.',
    tip: '<strong>Pro move:</strong> Use a whole tone run over a V7♯5 chord for instant jazz drama. Because there are no half-steps, every lick sounds smooth and exotic.',
  },

  'Diminished HW': {
    s1: [0],
    s2: [3, 6, 9],
    s3: [4, 7],
    av: [],
    theory: 'The <strong>Half-Whole Diminished</strong> scale repeats every 3 semitones, giving it 3-fold symmetry. It works over dominant 7th chords with added tension (7♭9, 7♯9). Your strongest landing points are the root and the diminished 7th chord tones — R, ♭3, ♭5, 6.',
    tip: '<strong>Pro move:</strong> Because the scale repeats every 3 frets, any lick can be shifted up or down 3 frets and remains in the scale. Use this for effortless sequential patterns.',
  },

  'Diminished WH': {
    s1: [0],
    s2: [3, 6, 9],
    s3: [2, 5],
    av: [],
    theory: 'The <strong>Whole-Half Diminished</strong> scale also has 3-fold symmetry and fits naturally over diminished 7th chords. The root, ♭3, ♭5 and 6 form the diminished 7th arpeggio — always your strongest landing notes. Used extensively in jazz, neoclassical metal and film scoring.',
    tip: '<strong>Pro move:</strong> Arpeggiate the dim7 chord tones (R–♭3–♭5–6) first, then fill in with passing tones. This keeps your phrase anchored even within this complex scale.',
  },

  // ─── MODES ───────────────────────────────────────────────────────────────
  // Mode names match ScalePattern.name exactly for lookup to work.

  'Ionian (Mode I)': {
    s1: [0],
    s2: [4, 7],
    s3: [9, 11],
    av: [5],
    theory: '<strong>Ionian</strong> is the Major scale — bright, resolved and happy. It sits perfectly over Imaj7 chords. The 3rd and 5th are your consonant pillars, and the 7th gives it a sophisticated warmth. The 4th remains the classical avoid note over a major 7th chord because it creates a ♭9 clash with the 3rd.',
    tip: '<strong>Pro move:</strong> Think of Ionian as home. When you want to sound resolved and melodic, lean on the 1–3–5 arpeggio as your phrase skeleton.',
  },

  'Dorian (Mode II)': {
    s1: [0],
    s2: [3, 7],
    s3: [9, 10],
    av: [],
    theory: '<strong>Dorian</strong> is a minor mode with a <em>raised 6th</em> compared to natural minor. This natural 6th is Dorian\'s signature — it gives it a sophisticated, less dark quality than Aeolian. Dorian sits over minor 7th chords and is the go-to scale for funk, jazz-fusion and 70s rock.',
    tip: '<strong>Pro move:</strong> A lick that hits ♭3–4–5–6–5 instantly signals Dorian. Emphasising the raised 6th is what separates Dorian phrasing from generic minor.',
  },

  'Phrygian (Mode III)': {
    s1: [0],
    s2: [3, 7],
    s3: [1, 8],
    av: [],
    theory: '<strong>Phrygian</strong> has a dark, menacing, Spanish-metal character. The ♭2 — just a half-step above the root — is its defining feature, creating intense tension that wants to fall back down to the root. This ♭2→1 resolution is one of the most dramatic moves in music.',
    tip: '<strong>Pro move:</strong> Alternate between the root note and the ♭II chord (one fret above) — this is the Phrygian stomp, the foundation of countless metal and flamenco riffs.',
  },

  'Lydian (Mode IV)': {
    s1: [0],
    s2: [4, 7],
    s3: [9, 11],
    av: [],
    theory: '<strong>Lydian</strong> is major with a raised 4th (♯4). The ♯4 creates a dreamy, floating, otherworldly quality — it is what makes film scores sound magical. It sits over maj7♯11 chords. Unlike Ionian, there is no avoid note, because the ♯4 does not clash with the 3rd.',
    tip: '<strong>Pro move:</strong> Play a major pentatonic phrase, then substitute the ♯4 where you would normally use the 4th. Instant Lydian flavour without losing melodic clarity.',
  },

  'Mixolydian (Mode V)': {
    s1: [0],
    s2: [4, 7],
    s3: [2, 9],
    av: [5],
    theory: '<strong>Mixolydian</strong> is major with a ♭7 — the rock scale. It sits over dominant 7th chords and has the brightness of major with the swagger of a flatted 7th. Used in blues-rock, classic rock, Celtic music and funk. The ♭7 is what defines it.',
    tip: '<strong>Pro move:</strong> Treat Mixolydian as major pentatonic with an added ♭7 approach note. Most classic rock solos over I7 chords are essentially Mixolydian.',
  },

  'Aeolian (Mode VI)': {
    s1: [0],
    s2: [3, 7],
    s3: [8, 10],
    av: [],
    theory: '<strong>Aeolian</strong> is the Natural Minor scale. Its ♭6 and ♭7 give it a melancholic, introspective character. There are no strong avoid notes, making Aeolian very forgiving for improvisers. The absence of a strong leading tone means phrases feel open and unresolved.',
    tip: '<strong>Pro move:</strong> The ♭6→5 descent creates a profound sense of longing and release — one of the most emotionally resonant moves in minor key melody writing.',
  },

  'Locrian (Mode VII)': {
    s1: [0],
    s2: [3, 6],
    s3: [8, 10],
    av: [1],
    theory: '<strong>Locrian</strong> is the darkest and most unstable mode. Its ♭5 means even the root triad is diminished — there is no stable perfect 5th to anchor to. This inherent instability makes it powerful over half-diminished chords in jazz. The ♭2 creates intense dissonance — use it only as a brief passing note.',
    tip: '<strong>Pro move:</strong> Over a ø7 chord, target the ♭3 and ♭5 — those are the chord tones. Use the ♭2 only as a lightning-fast chromatic passing tone.',
  },
}