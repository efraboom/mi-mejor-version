type Paso = { semana: number; titulo: string; descripcion: string; habitos_clave: string[] }

const PLAZO_WEEKS: Record<string, number> = {
  '3_meses': 12, '6_meses': 24, '1_año': 52,
}

function getCurrentPaso(pasos: Paso[], plazo: string, createdAt: string): Paso {
  const weeksElapsed = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
  )
  const totalWeeks   = PLAZO_WEEKS[plazo] ?? 12
  const weeksPerPaso = totalWeeks / pasos.length
  const index        = Math.min(Math.floor(weeksElapsed / weeksPerPaso), pasos.length - 1)
  return pasos[Math.max(0, index)]
}

export default function PlanEtapaCard({
  titulo, plazo, pasos, createdAt,
}: {
  titulo: string; plazo: string; pasos: Paso[]; createdAt: string
}) {
  const paso = getCurrentPaso(pasos, plazo, createdAt)
  if (!paso) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(143,166,140,.12), rgba(201,169,110,.08))',
      border: '0.8px solid rgba(143,166,140,.4)',
      borderLeft: '3px solid var(--sage)',
      borderRadius: 12, padding: '16px 20px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--sage2)', marginBottom: 2 }}>
            📍 Tu plan actual · Etapa {paso.semana}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: 'var(--brown)' }}>
            {paso.titulo}
          </div>
        </div>
        <span className="pill pill-sage" style={{ fontSize: 11 }}>{titulo}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: paso.habitos_clave?.length ? 10 : 0 }}>
        {paso.descripcion}
      </p>
      {paso.habitos_clave?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {paso.habitos_clave.map(h => (
            <span key={h} className="pill pill-sage" style={{ fontSize: 11 }}>{h}</span>
          ))}
        </div>
      )}
    </div>
  )
}
