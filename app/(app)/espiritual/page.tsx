'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

function today() { return new Date().toISOString().split('T')[0] }

function GratitudForm({ userId }: { userId: string }) {
  const [items, setItems] = useState(['', '', ''])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()
  const fecha = today()

  useEffect(() => {
    supabase.from('gratitud_entries').select('item1,item2,item3')
      .eq('user_id', userId).eq('fecha', fecha).maybeSingle()
      .then(({ data }) => {
        const d = data as { item1?: string | null; item2?: string | null; item3?: string | null } | null
        if (d) setItems([d.item1 ?? '', d.item2 ?? '', d.item3 ?? ''])
      })
  }, [userId])

  function change(i: number, val: string) {
    const next = [...items]; next[i] = val; setItems(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      await supabase.from('gratitud_entries').upsert(
        { user_id: userId, fecha, item1: next[0], item2: next[1], item3: next[2], updated_at: new Date().toISOString() },
        { onConflict: 'user_id,fecha' }
      )
    }, 800)
  }

  return (
    <div className="card card-rose">
      <h3>✨ Gratitud diaria</h3>
      <p style={{ marginBottom: 12 }}>Escribe 3 cosas por las que estás agradecida hoy:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['1. Hoy agradezco...', '2. También agradezco...', '3. Y sobre todo, agradezco...'].map((ph, i) => (
          <input
            key={i}
            placeholder={ph}
            value={items[i]}
            onChange={e => change(i, e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '0.8px solid var(--cream2)', fontFamily: "'Lato',sans-serif", fontSize: 13, color: 'var(--text)', outline: 'none', background: 'var(--white)' }}
          />
        ))}
      </div>
    </div>
  )
}

export default function EspiritualPage() {
  const [userId, setUserId] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) })
  }, [])

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 9</div>
        <h2>Vida <span className="script">espiritual</span></h2>
        <div className="sec-divider" />
        <p>Tu relación con Dios no se construye con perfección — se construye con constancia y honestidad.</p>
      </div>

      <div className="devotion-block">
        <h3>🕊️ Devocional diario simple — 10–15 min</h3>
        <div className="verse-box">
          <p>"Todo lo puedo en Cristo que me fortalece."</p>
          <small>Filipenses 4:13 ✦</small>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
          Estructura simple para tu tiempo con Dios:<br />
          <strong>1.</strong> Ora primero (3 min) — Agradecer antes de pedir.<br />
          <strong>2.</strong> Lee (5–7 min) — Un capítulo o porción del día.<br />
          <strong>3.</strong> Reflexiona (3 min) — ¿Qué me habla Dios aquí?<br />
          <strong>4.</strong> Aplica (1 min) — ¿Cómo lo vivo hoy?
        </p>
      </div>

      <div className="g2">
        <div className="card card-gold">
          <h3>🙏 Hábitos espirituales sostenibles</h3>
          <ul style={{ marginTop: 10 }}>
            {[
              'Oración al despertar — aunque sea 3 minutos',
              'Devocional diario con Biblia',
              'Gratitud escrita antes de dormir (3 cosas)',
              'Escuchar música de adoración durante el día',
              'Leer libros de crecimiento espiritual (1/mes)',
              'Un día de ayuno al mes (si lo sientes en tu corazón)',
              'Comunidad de fe — no caminar sola',
            ].map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
        {userId && <GratitudForm userId={userId} />}
      </div>

      <div className="affirm-card">
        <p>"Dios mis planes, disciplina mi camino, mi mejor versión."</p>
        <small>✦ Tu mantra de transformación ✦</small>
      </div>
    </div>
  )
}
