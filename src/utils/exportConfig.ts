import type { LensParams } from '../types'
import { getMaterial } from '../config/materials'
import { getTempleStyle } from '../config/templeStyles'

export function exportConfigAsJson(materialId: string, templeStyleId: string, lens: LensParams) {
  const material = getMaterial(materialId)
  const temple = getTempleStyle(templeStyleId)

  const payload = {
    generatedAt: new Date().toISOString(),
    material: {
      id: material.id,
      label: material.label,
      category: material.category,
      colorHex: material.colorHex,
      metalness: material.metalness,
      roughness: material.roughness,
    },
    templeStyle: {
      id: temple.id,
      name: temple.name,
      curvature: temple.curvature,
      thicknessMm: temple.thickness,
      taper: temple.taper,
      endType: temple.endType,
    },
    lensParamsMm: {
      width: lens.width,
      height: lens.height,
      bridge: lens.bridge,
      roundness: lens.roundness,
      frontCurve: lens.frontCurve,
    },
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `szemuveg-konfiguracio-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
