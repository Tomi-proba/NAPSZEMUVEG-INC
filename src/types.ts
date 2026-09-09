export type MaterialCategory = 'metal' | 'acetate'

export interface MaterialOption {
  id: string
  category: MaterialCategory
  label: string
  colorHex: string
  metalness: number
  roughness: number
  clearcoat?: number
}

export type TempleEndType = 'straight' | 'looped' | 'ball'

export interface TempleStyle {
  id: string
  name: string
  /** 0 = nearly straight, 1 = strongly curved toward the ear */
  curvature: number
  /** base radius of the temple arm, in mm */
  thickness: number
  /** whether the arm tapers thinner toward the tip */
  taper: boolean
  endType: TempleEndType
}

export interface LensParams {
  width: number
  height: number
  bridge: number
  roundness: number
  frontCurve: number
}

export interface ConfiguratorState {
  materialId: string
  templeStyleId: string
  lens: LensParams
}
