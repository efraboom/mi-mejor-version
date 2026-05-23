import { createClient } from '@/lib/supabase/server'
import JournalBox from '@/components/journal/JournalBox'
import Affirmations from '@/components/Affirmations'

export default async function EmocionalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 7</div>
        <h2>Bienestar <span className="script">emocional y mental</span></h2>
        <div className="sec-divider" />
        <p>Tus emociones no son tus enemigas. Son mensajeras. Aprender a escucharlas es poder.</p>
      </div>

      <JournalBox userId={user!.id} />

      {/* Afirmaciones */}
      <div style={{ marginTop: 20 }}>
        <div className="sec-tag" style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
          Afirmaciones diarias
        </div>
        <Affirmations />
      </div>

      {/* Regulación emocional */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>🧘 Herramientas de regulación emocional</h3>
        <div className="g2" style={{ marginTop: 12 }}>
          {[
            { title: '🌬️ Respiración 4-7-8', desc: 'Inhala 4 seg → Sostén 7 seg → Exhala 8 seg. Repite 3–4 veces. Activa el sistema nervioso parasimpático al instante.' },
            { title: '🧊 Técnica 5-4-3-2-1', desc: '5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas. Ancla al presente en segundos.' },
            { title: '💔 Después de fallar', desc: '1) Reconoce lo que pasó sin drama. 2) Pregunta: ¿qué aprendí? 3) Decide 1 acción pequeña para mañana. 4) Suéltalo con oración.' },
            { title: '😔 Para la desmotivación', desc: 'No esperes motivación — actúa primero, la motivación llega después. Haz solo 2 minutos de la tarea. El movimiento genera la chispa.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ padding: 16, background: 'var(--cream)', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: 'var(--brown)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
