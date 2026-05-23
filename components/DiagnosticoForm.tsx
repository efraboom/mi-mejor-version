'use client'
import { useDiagnostico } from '@/lib/hooks/useDiagnostico'

const CARDS = [
  {
    id: 'rutina', title: '🌅 Mi rutina actual', clase: 'card-rose',
    preguntas: [
      { key: 'rutina_horarios',  label: '¿A qué hora me levanto y me duermo normalmente?', placeholder: 'Sé honesta contigo misma...' },
      { key: 'rutina_mananas',   label: '¿Cómo son mis mañanas hoy?', placeholder: 'Describe tu mañana típica...' },
    ],
  },
  {
    id: 'energia', title: '⚡ Mis niveles de energía', clase: 'card-sage',
    preguntas: [
      { key: 'energia_picos',    label: '¿En qué momentos del día tengo más energía?', placeholder: 'Mañana, tarde, noche...' },
      { key: 'energia_ladrones', label: '¿Qué me roba energía sin que me dé cuenta?', placeholder: 'Personas, hábitos, pensamientos...' },
    ],
  },
  {
    id: 'bloqueos', title: '🧱 Mis bloqueos reales', clase: 'card-gold',
    preguntas: [
      { key: 'bloqueos_impedido', label: '¿Qué me ha impedido cambiar antes?', placeholder: 'Sin juicio, solo observación...' },
      { key: 'bloqueos_miedo',    label: '¿Cuál es mi mayor miedo ante el cambio?', placeholder: 'Sé vulnerable y honesta...' },
    ],
  },
  {
    id: 'economia', title: '💰 Situación económica y profesional', clase: 'card-rose',
    preguntas: [
      { key: 'eco_financiera',   label: '¿Cómo está mi situación financiera hoy?', placeholder: 'Con qué cuento, qué falta...' },
      { key: 'eco_profesional',  label: '¿Qué quiero construir profesionalmente?', placeholder: 'Tu visión a 1 año...' },
    ],
  },
  {
    id: 'espiritual', title: '🙏 Mi relación con Dios', clase: 'card-sage',
    preguntas: [
      { key: 'esp_vida',  label: '¿Cómo está mi vida espiritual hoy?', placeholder: '¿Cercana, distante, en búsqueda?...' },
      { key: 'esp_fe',    label: '¿Qué quiero fortalecer en mi fe?', placeholder: 'Lo que anhelas en tu corazón...' },
    ],
  },
  {
    id: 'prioridades', title: '🌟 Mis prioridades', clase: 'card-gold',
    preguntas: [
      { key: 'pri_trescosas', label: '¿Qué 3 cosas quiero cambiar primero?', placeholder: 'Sé específica y realista...' },
      { key: 'pri_90dias',    label: '¿Cómo quiero sentirme en 90 días?', placeholder: 'Describe esa versión de ti...' },
    ],
  },
]

export default function DiagnosticoForm({ userId }: { userId: string }) {
  const { get, set, saveCard, isSaved, loading } = useDiagnostico(userId)

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
      Cargando tus respuestas...
    </div>
  )

  return (
    <>
      {[0, 2, 4].map(i => {
        const pair = [CARDS[i], CARDS[i + 1]]
        return (
          <div key={i} className="g2">
            {pair.map(card => {
              const keys = card.preguntas.map(p => p.key)
              const allSaved = isSaved(keys)
              return (
                <div key={card.id} className={`card ${card.clase}`}>
                  <h3>{card.title}</h3>
                  {card.preguntas.map(p => (
                    <div key={p.key} className="review-q">
                      <label>{p.label}</label>
                      <textarea
                        placeholder={p.placeholder}
                        value={get(p.key)}
                        onChange={e => set(p.key, e.target.value)}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <button
                      className="save-btn"
                      style={{ marginTop: 0, fontSize: 12, padding: '7px 18px' }}
                      onClick={() => saveCard(keys)}
                    >
                      Guardar
                    </button>
                    {allSaved && (
                      <span style={{ fontSize: 12, color: 'var(--sage2)', fontWeight: 700 }}>
                        Guardado ✓
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <div className="tip-box">
        <p>💡 <strong>Tip de mentora:</strong> No hay respuestas correctas o incorrectas. Este diagnóstico es tu punto de partida, no tu definición. Eres más que donde estás hoy.</p>
      </div>
    </>
  )
}
