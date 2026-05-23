'use client'
import { useProgress } from '@/lib/hooks/useProgress'

const AREAS = [
  { id: 'esp' as const, name: '✝️ Espiritual',   fill: 'pf-gold' },
  { id: 'fis' as const, name: '💪 Física',        fill: 'pf-rose' },
  { id: 'men' as const, name: '🧠 Mental',        fill: 'pf-sage' },
  { id: 'emo' as const, name: '🤍 Emocional',     fill: 'pf-rose' },
  { id: 'pro' as const, name: '💼 Profesional',   fill: 'pf-gold' },
  { id: 'fin' as const, name: '💸 Financiera',    fill: 'pf-sage' },
]

export default function ProgressSliders({ userId }: { userId: string }) {
  const { scores, loading } = useProgress(userId)

  if (loading) return <div style={{ color: 'var(--muted)', padding: 16 }}>Cargando progreso...</div>

  return (
    <div className="card">
      <h3>📊 Indicadores de progreso por área</h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, marginBottom: 20 }}>
        Se actualiza automáticamente cada vez que marcas un hábito en el tracker.
      </p>
      <div>
        {AREAS.map(({ id, name, fill }) => (
          <div key={id} className="prog-item">
            <div className="prog-label">
              <span>{name}</span>
              <span>{scores[id]}%</span>
            </div>
            <div className="prog-bar">
              <div
                className={`prog-fill ${fill}`}
                style={{ width: `${scores[id]}%`, transition: 'width 0.6s ease' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
