'use client'
import { useMetaProgreso } from '@/lib/hooks/useMetaProgreso'

type Paso = { semana: number; titulo: string; descripcion: string; habitos_clave: string[] }

const PLAZO_LABEL: Record<string, string> = {
  '3_meses': '3 meses', '6_meses': '6 meses', '1_año': '1 año',
}

const PASO_COLORS = [
  { bg: 'rgba(143,166,140,.12)', border: 'var(--sage)',  fill: 'pf-sage' },
  { bg: 'rgba(201,169,110,.10)', border: 'var(--gold)',  fill: 'pf-gold' },
  { bg: 'rgba(212,168,160,.12)', border: 'var(--blush)', fill: 'pf-rose' },
]

function formatFecha(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

export default function MetaCard({
  titulo, plazo, pasos, metaId, userId,
}: {
  titulo: string; plazo: string; pasos: Paso[]
  metaId: string; userId: string
}) {
  const { completed, fechas, toggle } = useMetaProgreso(userId, metaId)

  const totalHabitos    = pasos.reduce((acc, p) => acc + (p.habitos_clave?.length ?? 0), 0)
  const completedCount  = completed.size
  const progressPct     = totalHabitos > 0 ? Math.round((completedCount / totalHabitos) * 100) : 0
  const semanasCompletas = pasos.filter(p =>
    p.habitos_clave?.every((_, hi) => completed.has(`${p.semana}-${hi}`))
  ).length

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,168,160,.12), rgba(201,169,110,.10))',
        border: '0.8px solid rgba(201,169,110,.3)', borderRadius: 12,
        padding: '20px 24px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
              Tu meta
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: 'var(--brown)' }}>
              {titulo}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span className="pill pill-gold" style={{ fontSize: 12 }}>
              📅 {PLAZO_LABEL[plazo] ?? plazo}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {semanasCompletas}/{pasos.length} etapas · {progressPct}%
            </span>
          </div>
        </div>

        {/* Barra de progreso general */}
        <div className="prog-bar" style={{ height: 6 }}>
          <div className="prog-fill pf-gold" style={{ width: `${progressPct}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Pasos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pasos.map((paso, i) => {
          const color    = PASO_COLORS[i % PASO_COLORS.length]
          const allDone  = paso.habitos_clave?.length > 0 &&
            paso.habitos_clave.every((_, hi) => completed.has(`${paso.semana}-${hi}`))

          return (
            <div key={paso.semana} style={{
              background: allDone ? 'rgba(143,166,140,.08)' : color.bg,
              border: `0.8px solid ${color.border}`,
              borderLeft: `3px solid ${color.border}`,
              borderRadius: 10, padding: '16px 20px',
              opacity: allDone ? 0.85 : 1,
              transition: 'all 0.3s ease',
            }}>
              {/* Cabecera del paso */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: 'var(--brown)', lineHeight: 1 }}>
                    {String(paso.semana).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brown)' }}>{paso.titulo}</span>
                </div>
                {allDone && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage2)', whiteSpace: 'nowrap' }}>
                    ✓ Completado
                  </span>
                )}
              </div>

              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: paso.habitos_clave?.length ? 12 : 0 }}>
                {paso.descripcion}
              </p>

              {/* Hábitos con checkboxes */}
              {paso.habitos_clave?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {paso.habitos_clave.map((h, hi) => {
                    const key   = `${paso.semana}-${hi}`
                    const done  = completed.has(key)
                    const fecha = fechas[key]
                    return (
                      <div
                        key={hi}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <button
                          onClick={() => toggle(paso.semana, hi)}
                          className={`check-box${done ? ' done' : ''}`}
                          style={{ flexShrink: 0, cursor: 'pointer' }}
                          aria-label={done ? 'Marcar como pendiente' : 'Marcar como hecho'}
                        >
                          {done ? '✓' : ''}
                        </button>
                        <span style={{
                          fontSize: 13,
                          color: done ? 'var(--muted)' : 'var(--brown)',
                          textDecoration: done ? 'line-through' : 'none',
                          flex: 1,
                        }}>
                          {h}
                        </span>
                        {done && fecha && (
                          <span style={{ fontSize: 11, color: 'var(--sage2)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {formatFecha(fecha)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
