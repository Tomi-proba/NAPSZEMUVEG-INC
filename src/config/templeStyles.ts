import type { TempleEndType, TempleStyle } from '../types'

const CURVATURES: { value: number; label: string }[] = [
  { value: 0.15, label: 'Egyenes' },
  { value: 0.45, label: 'Enyhén ívelt' },
  { value: 0.75, label: 'Erősen ívelt' },
]

const THICKNESSES: { value: number; label: string }[] = [
  { value: 1.4, label: 'vékony' },
  { value: 2.0, label: 'közepes' },
  { value: 2.7, label: 'vastag' },
]

const TAPERS: { value: boolean; label: string }[] = [
  { value: false, label: 'egyenletes' },
  { value: true, label: 'kúpos' },
]

const END_TYPES: { value: TempleEndType; label: string }[] = [
  { value: 'straight', label: 'egyenes véggel' },
  { value: 'looped', label: 'hurkolt véggel' },
  { value: 'ball', label: 'gömbdíszes véggel' },
]

function generateTempleStyles(): TempleStyle[] {
  const styles: TempleStyle[] = []
  for (const curvature of CURVATURES) {
    for (const thickness of THICKNESSES) {
      for (const taper of TAPERS) {
        for (const end of END_TYPES) {
          const id = `temple-${curvature.value}-${thickness.value}-${taper.value ? 'taper' : 'flat'}-${end.value}`
          const name = `${curvature.label}, ${thickness.label}, ${taper.label}, ${end.label}`
          styles.push({
            id,
            name,
            curvature: curvature.value,
            thickness: thickness.value,
            taper: taper.value,
            endType: end.value,
          })
        }
      }
    }
  }
  return styles
}

export const TEMPLE_STYLES: TempleStyle[] = generateTempleStyles()

export const getTempleStyle = (id: string): TempleStyle =>
  TEMPLE_STYLES.find((t) => t.id === id) ?? TEMPLE_STYLES[0]
