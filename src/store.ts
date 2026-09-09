import { create } from 'zustand'
import type { LensParams } from './types'
import { MATERIALS } from './config/materials'
import { TEMPLE_STYLES } from './config/templeStyles'

export const DEFAULT_LENS: LensParams = {
  width: 44,
  height: 34,
  bridge: 18,
  roundness: 0.4,
  frontCurve: 0.35,
}

export const DEFAULT_MATERIAL_ID = MATERIALS[0].id
export const DEFAULT_TEMPLE_ID = TEMPLE_STYLES[7].id

interface ConfiguratorStore {
  materialId: string
  templeStyleId: string
  lens: LensParams
  setMaterial: (id: string) => void
  setTempleStyle: (id: string) => void
  setLens: (patch: Partial<LensParams>) => void
  reset: () => void
}

export const useConfiguratorStore = create<ConfiguratorStore>((set) => ({
  materialId: DEFAULT_MATERIAL_ID,
  templeStyleId: DEFAULT_TEMPLE_ID,
  lens: { ...DEFAULT_LENS },
  setMaterial: (id) => set({ materialId: id }),
  setTempleStyle: (id) => set({ templeStyleId: id }),
  setLens: (patch) => set((state) => ({ lens: { ...state.lens, ...patch } })),
  reset: () =>
    set({
      materialId: DEFAULT_MATERIAL_ID,
      templeStyleId: DEFAULT_TEMPLE_ID,
      lens: { ...DEFAULT_LENS },
    }),
}))
