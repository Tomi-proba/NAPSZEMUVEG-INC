import MaterialStep from './MaterialStep'
import TempleStep from './TempleStep'
import LensStep from './LensStep'
import { useConfiguratorStore } from '../../store'
import { exportConfigAsJson } from '../../utils/exportConfig'

export default function Panel() {
  const materialId = useConfiguratorStore((s) => s.materialId)
  const templeStyleId = useConfiguratorStore((s) => s.templeStyleId)
  const lens = useConfiguratorStore((s) => s.lens)
  const reset = useConfiguratorStore((s) => s.reset)

  return (
    <aside className="panel">
      <div className="panel__header">
        <h1>Szemüveg konfigurátor</h1>
        <p>Állítsd össze a saját kereted három lépésben.</p>
      </div>
      <div className="panel__steps">
        <MaterialStep />
        <TempleStep />
        <LensStep />
      </div>
      <div className="panel__actions">
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Alapbeállítások visszaállítása
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => exportConfigAsJson(materialId, templeStyleId, lens)}
        >
          Konfiguráció exportálása JSON-ba
        </button>
      </div>
    </aside>
  )
}
