import { TEMPLE_STYLES } from '../../config/templeStyles'
import { useConfiguratorStore } from '../../store'
import TempleIcon from '../TempleIcon'

export default function TempleStep() {
  const templeStyleId = useConfiguratorStore((s) => s.templeStyleId)
  const setTempleStyle = useConfiguratorStore((s) => s.setTempleStyle)

  return (
    <section className="card">
      <header className="card__header">
        <span className="card__step">2</span>
        <h2>Szár (temple) választás</h2>
      </header>
      <p className="card__hint">{TEMPLE_STYLES.length} procedurálisan generált stílus</p>
      <div className="temple-grid">
        {TEMPLE_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            className={`temple-option ${templeStyleId === style.id ? 'temple-option--active' : ''}`}
            onClick={() => setTempleStyle(style.id)}
            title={style.name}
          >
            <TempleIcon style={style} className="temple-option__icon" />
          </button>
        ))}
      </div>
    </section>
  )
}
