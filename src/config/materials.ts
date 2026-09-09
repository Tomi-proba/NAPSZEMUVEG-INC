import type { MaterialOption } from '../types'

export const MATERIALS: MaterialOption[] = [
  // Metal — shiny, high metalness, low roughness
  {
    id: 'metal-silver',
    category: 'metal',
    label: 'Ezüst',
    colorHex: '#c9cdd1',
    metalness: 1,
    roughness: 0.15,
  },
  {
    id: 'metal-gold',
    category: 'metal',
    label: 'Arany',
    colorHex: '#d4af6a',
    metalness: 1,
    roughness: 0.18,
  },
  {
    id: 'metal-black',
    category: 'metal',
    label: 'Fekete',
    colorHex: '#2a2b2e',
    metalness: 0.95,
    roughness: 0.22,
  },
  {
    id: 'metal-anthracite',
    category: 'metal',
    label: 'Antracit',
    colorHex: '#5a5d63',
    metalness: 0.95,
    roughness: 0.2,
  },
  {
    id: 'metal-rosegold',
    category: 'metal',
    label: 'Rozéarany',
    colorHex: '#caa08a',
    metalness: 1,
    roughness: 0.17,
  },

  // Acetate / plastic — matte, low metalness, high roughness
  {
    id: 'acetate-matte-black',
    category: 'acetate',
    label: 'Matt fekete',
    colorHex: '#1c1c1e',
    metalness: 0.02,
    roughness: 0.85,
  },
  {
    id: 'acetate-tortoise',
    category: 'acetate',
    label: 'Tortoise barna',
    colorHex: '#7a4a25',
    metalness: 0.02,
    roughness: 0.8,
  },
  {
    id: 'acetate-crystal',
    category: 'acetate',
    label: 'Kristály áttetsző',
    colorHex: '#dfe7e6',
    metalness: 0.0,
    roughness: 0.35,
    clearcoat: 0.6,
  },
  {
    id: 'acetate-red',
    category: 'acetate',
    label: 'Piros',
    colorHex: '#a52630',
    metalness: 0.02,
    roughness: 0.75,
  },
  {
    id: 'acetate-olive',
    category: 'acetate',
    label: 'Olívazöld',
    colorHex: '#556b3c',
    metalness: 0.02,
    roughness: 0.8,
  },
]

export const getMaterial = (id: string): MaterialOption =>
  MATERIALS.find((m) => m.id === id) ?? MATERIALS[0]
