import { useMemo, useState } from 'react'
import { MATERIALS } from '../../config/materials'
import type { MaterialCategory } from '../../types'
import { useConfiguratorStore } from '../../store'

const CATEGORY_LABEL: Record<MaterialCategory, string> = {
  metal: 'Fém',
  acetate: 'Acetát / műanyag',
}

export default function MaterialStep() {
  const materialId = useConfiguratorStore((s) => s.materialId)
  const setMaterial = useConfiguratorStore((s) => s.setMaterial)
  const activeCategory = useMemo(
    () => MATERIALS.find((m) => m.id === materialId)?.category ?? 'metal',
    [materialId],
  )
  const [category, setCategory] = useState<MaterialCategory>(activeCategory)

  const options = MATERIALS.filter((m) => m.category === category)

  return (
    <section className="card">
      <header className="card__header">
        <span className="card__step">1</span>
        <h2>Anyagválasztás</h2>
      </header>
      <div className="tabs">
        {(['metal', 'acetate'] as MaterialCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`tab ${category === cat ? 'tab--active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>
      <div className="swatch-grid">
        {options.map((material) => (
          <button
            key={material.id}
            type="button"
            className={`swatch ${materialId === material.id ? 'swatch--active' : ''}`}
            onClick={() => setMaterial(material.id)}
            title={material.label}
          >
            <span
              className="swatch__color"
              style={{
                background: material.colorHex,
                boxShadow:
                  material.category === 'metal'
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.25)'
                    : 'inset 0 -2px 4px rgba(0,0,0,0.15)',
              }}
            />
            <span className="swatch__label">{material.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
