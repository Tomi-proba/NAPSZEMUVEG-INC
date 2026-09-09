import type { LensParams } from '../../types'
import { useConfiguratorStore } from '../../store'

interface SliderDef {
  key: keyof LensParams
  label: string
  min: number
  max: number
  step: number
  format: (v: number) => string
}

const SLIDERS: SliderDef[] = [
  {
    key: 'width',
    label: 'Lencse szélessége',
    min: 30,
    max: 58,
    step: 0.5,
    format: (v) => `${v.toFixed(1)} mm`,
  },
  {
    key: 'height',
    label: 'Lencse magassága',
    min: 24,
    max: 48,
    step: 0.5,
    format: (v) => `${v.toFixed(1)} mm`,
  },
  {
    key: 'bridge',
    label: 'Híd (orrnyereg) szélessége',
    min: 12,
    max: 26,
    step: 0.5,
    format: (v) => `${v.toFixed(1)} mm`,
  },
  {
    key: 'roundness',
    label: 'Lencse lekerekítettsége',
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => `${Math.round(v * 100)}% kerekített`,
  },
  {
    key: 'frontCurve',
    label: 'Keret előlapjának görbülete',
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => `${Math.round(v * 100)}%`,
  },
]

export default function LensStep() {
  const lens = useConfiguratorStore((s) => s.lens)
  const setLens = useConfiguratorStore((s) => s.setLens)

  return (
    <section className="card">
      <header className="card__header">
        <span className="card__step">3</span>
        <h2>Lencse elhelyezés / méretezés</h2>
      </header>
      <div className="slider-list">
        {SLIDERS.map((slider) => (
          <label key={slider.key} className="slider-row">
            <div className="slider-row__top">
              <span>{slider.label}</span>
              <span className="slider-row__value">{slider.format(lens[slider.key])}</span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={lens[slider.key]}
              onChange={(e) =>
                setLens({ [slider.key]: Number(e.target.value) } as Partial<LensParams>)
              }
            />
          </label>
        ))}
      </div>
    </section>
  )
}
