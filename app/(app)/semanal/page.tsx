'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const DAYS = [
  { name: 'Lunes',     icon: '🎯', focus: 'Inicio y plan' },
  { name: 'Martes',    icon: '💼', focus: 'Trabajo profundo' },
  { name: 'Miércoles', icon: '🌿', focus: 'Bienestar y cuerpo' },
  { name: 'Jueves',    icon: '💸', focus: 'Finanzas y proyectos' },
  { name: 'Viernes',   icon: '🎨', focus: 'Creatividad y cierre' },
  { name: 'Sábado',    icon: '💆', focus: 'Descanso activo' },
  { name: 'Domingo',   icon: '🙏', focus: 'Reflexión y Dios' },
]

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0]
}

function weekLabel(ws: string): string {
  const d = new Date(ws + 'T12:00:00')
  const e = new Date(d); e.setDate(d.getDate() + 6)
  const month = e.toLocaleDateString('es', { month: 'long' })
  return `${d.getDate()}–${e.getDate()} de ${month} ${e.getFullYear()}`
}

type Review = {
  celebro?: string; habitos_cumplidos?: string
  ajustes?: string; intencion?: string; resumen_ia?: string
}

type Historial = { week_start: string; resumen_ia: string | null }

type PlanPaso = { semana: number; titulo: string; habitos_clave: string[] }

const PLAZO_WEEKS: Record<string, number> = { '3_meses': 12, '6_meses': 24, '1_año': 52 }

function getCurrentPaso(pasos: PlanPaso[], plazo: string, createdAt: string): PlanPaso | null {
  if (!pasos?.length) return null
  const weeksElapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000))
  const totalWeeks   = PLAZO_WEEKS[plazo] ?? 12
  const index        = Math.min(Math.floor(weeksElapsed / (totalWeeks / pasos.length)), pasos.length - 1)
  return pasos[Math.max(0, index)]
}

export default function SemanalPage() {
  const [userId, setUserId]           = useState('')
  const weekStart                     = getWeekStart()
  const todayIdx                      = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const [data, setData]               = useState<Review>({})
  const [saving, setSaving]           = useState(false)
  const [generando, setGenerando]     = useState(false)
  const [errorResumen, setErrorResumen] = useState('')
  const [historial, setHistorial]     = useState<Historial[]>([])
  const [planPaso, setPlanPaso]       = useState<PlanPaso | null>(null)
  const timer                         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase                      = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)

      // Carga revisión actual
      supabase.from('weekly_reviews')
        .select('celebro,habitos_cumplidos,ajustes,intencion,resumen_ia')
        .eq('user_id', user.id).eq('week_start', weekStart).maybeSingle()
        .then(({ data: d }) => { if (d) setData(d as Review) })

      // Historial de resúmenes pasados
      supabase.from('weekly_reviews')
        .select('week_start,resumen_ia')
        .eq('user_id', user.id)
        .not('resumen_ia', 'is', null)
        .order('week_start', { ascending: false })
        .limit(12)
        .then(({ data: h }) => { if (h) setHistorial(h as Historial[]) })

      // Plan activo para contexto
      supabase.from('metas')
        .select('titulo,plazo,pasos,created_at')
        .eq('user_id', user.id).eq('activa', true).maybeSingle()
        .then(({ data: m }) => {
          if (m) {
            const paso = getCurrentPaso(
              m.pasos as PlanPaso[], m.plazo as string, m.created_at as string
            )
            setPlanPaso(paso)
          }
        })
    })
  }, [])

  function update(field: keyof Review, val: string) {
    setData(prev => ({ ...prev, [field]: val }))
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setSaving(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('weekly_reviews') as any).upsert(
        { user_id: userId, week_start: weekStart, ...data, [field]: val, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,week_start' }
      )
      setSaving(false)
    }, 800)
  }

  async function generarResumen() {
    setGenerando(true)
    setErrorResumen('')
    try {
      const res = await fetch('/api/resumen-semanal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: data, planEtapa: planPaso, weekLabel: weekLabel(weekStart) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const resumen = json.resumen as string
      setData(prev => ({ ...prev, resumen_ia: resumen }))

      // Guardar resumen en DB
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('weekly_reviews') as any).upsert(
        { user_id: userId, week_start: weekStart, ...data, resumen_ia: resumen, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,week_start' }
      )

      // Actualizar historial
      setHistorial(prev => {
        const filtered = prev.filter(h => h.week_start !== weekStart)
        return [{ week_start: weekStart, resumen_ia: resumen }, ...filtered]
      })
    } catch (e: unknown) {
      setErrorResumen(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setGenerando(false)
    }
  }

  if (!userId) return null

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 6</div>
        <h2>Sistema <span className="script">semanal</span></h2>
        <div className="sec-divider" />
        <p>Cada semana tiene un enfoque. Esto evita que todo sea urgente y nada sea prioritario.</p>
      </div>

      {/* Contexto del plan actual */}
      {planPaso && (
        <div style={{
          background: 'rgba(143,166,140,.1)', border: '0.8px solid rgba(143,166,140,.35)',
          borderLeft: '3px solid var(--sage)', borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, color: 'var(--brown)',
        }}>
          <span style={{ fontWeight: 700 }}>📍 Etapa {planPaso.semana} de tu plan:</span>{' '}
          {planPaso.titulo}
          {planPaso.habitos_clave?.length > 0 && (
            <span style={{ color: 'var(--muted)' }}> · Enfoque: {planPaso.habitos_clave.join(', ')}</span>
          )}
        </div>
      )}

      <div className="week-grid">
        {DAYS.map((d, i) => (
          <div key={d.name} className={`day-card${i === todayIdx ? ' today' : ''}`}>
            <div className="day-name">{d.name}</div>
            <div className="day-icon">{d.icon}</div>
            <div className="day-focus">{d.focus}</div>
          </div>
        ))}
      </div>

      {/* Revisión semanal */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>📝 Revisión semanal — {weekLabel(weekStart)}</h3>
          {saving && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Guardando...</span>}
        </div>

        <div>
          {[
            { key: 'celebro' as const,          label: '¿Qué celebro de esta semana?',         placeholder: 'Escribe 3 victorias, aunque sean pequeñas...' },
            { key: 'habitos_cumplidos' as const, label: '¿Qué hábitos cumplí / cuántos días?', placeholder: 'Revisa tu tracker y cuenta...' },
            { key: 'ajustes' as const,           label: '¿Qué necesito ajustar la próxima semana?', placeholder: 'Sin perfeccionismo, solo ajuste...' },
            { key: 'intencion' as const,         label: 'Mi intención de la próxima semana:',  placeholder: 'Una frase que te inspire y te ancle...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="review-q">
              <label>{label}</label>
              <textarea placeholder={placeholder} value={data[key] ?? ''} onChange={e => update(key, e.target.value)} />
            </div>
          ))}
        </div>

        {errorResumen && (
          <div style={{ padding: '8px 12px', background: 'rgba(181,112,106,.1)', borderRadius: 8, fontSize: 12, color: 'var(--rose)', marginBottom: 10 }}>
            {errorResumen}
          </div>
        )}

        <button className="save-btn" onClick={generarResumen} disabled={generando} style={{ marginTop: 8 }}>
          {generando ? 'Generando resumen... ✨' : 'Generar resumen de mi semana ✨'}
        </button>

        {/* Resumen IA de esta semana */}
        {data.resumen_ia && (
          <div style={{
            marginTop: 20, padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(212,168,160,.1), rgba(201,169,110,.08))',
            border: '0.8px solid rgba(201,169,110,.3)', borderLeft: '3px solid var(--gold)',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
              ✨ Tu resumen de la semana
            </div>
            <p style={{ fontSize: 14, color: 'var(--brown)', lineHeight: 1.8, fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>
              {data.resumen_ia}
            </p>
          </div>
        )}
      </div>

      {/* Seguimiento — historial de resúmenes */}
      {historial.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="sec-tag" style={{ display: 'block', marginBottom: 4 }}>Tu historial</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>
              Seguimiento semanal
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {historial.map((h, i) => (
              <div key={h.week_start} style={{
                padding: '16px 20px',
                background: i === 0 ? 'rgba(143,166,140,.08)' : 'var(--white)',
                border: '0.8px solid var(--cream2)',
                borderLeft: `3px solid ${i === 0 ? 'var(--sage)' : 'var(--cream2)'}`,
                borderRadius: 10,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, letterSpacing: 0.5 }}>
                  {i === 0 ? '📍 Esta semana · ' : ''}{weekLabel(h.week_start)}
                </div>
                <p style={{ fontSize: 13, color: 'var(--brown)', lineHeight: 1.7, margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                  {h.resumen_ia}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
