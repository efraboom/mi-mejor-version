import { createClient } from '@/lib/supabase/server'
import ProgressDashboard from '@/components/progress/ProgressDashboard'

export default async function ProgresoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 10</div>
        <h2>Mi <span className="script">progreso</span></h2>
        <div className="sec-divider" />
        <p>El progreso no siempre es visible. Pero siempre es real cuando actúas con intención.</p>
      </div>

      <ProgressDashboard userId={user!.id} />

      {/* Sistema de recompensas */}
      <div className="card card-gold" style={{ marginTop: 24 }}>
        <h3>🏆 Sistema de recompensas</h3>
        <div className="g3" style={{ marginTop: 12 }}>
          {[
            { icon: '🌱', dias: '3 días seguidos',   premio: 'Tiempo de autocuidado especial' },
            { icon: '🌿', dias: '1 semana completa', premio: 'Capricho favorito o paseo' },
            { icon: '🌳', dias: '1 mes de constancia', premio: 'Experiencia memorable' },
            { icon: '👑', dias: '90 días de sistema', premio: '¡Celebración grande! Mereces todo' },
          ].map(({ icon, dias, premio }) => (
            <div key={dias} style={{ textAlign: 'center', padding: 16, background: 'var(--cream)', borderRadius: 10 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)' }}>{dias}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{premio}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
