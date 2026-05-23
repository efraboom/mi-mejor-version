'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MetaCard from './MetaCard'

type Paso = { semana: number; titulo: string; descripcion: string; habitos_clave: string[] }

const PLAZOS = [
  { value: '3_meses',  label: '3 meses' },
  { value: '6_meses',  label: '6 meses' },
  { value: '1_año',    label: '1 año' },
]

// Calcula fecha límite según plazo
function fechaLimite(plazo: string): string {
  const d = new Date()
  const map: Record<string, () => void> = {
    '1_semana': () => d.setDate(d.getDate() + 7),
    '1_mes':    () => d.setMonth(d.getMonth() + 1),
    '3_meses':  () => d.setMonth(d.getMonth() + 3),
    '6_meses':  () => d.setMonth(d.getMonth() + 6),
    '1_año':    () => d.setFullYear(d.getFullYear() + 1),
  }
  map[plazo]?.()
  return d.toISOString().split('T')[0]
}

export default function MetaForm({
  userId,
  diagnostico,
  metaActiva,
}: {
  userId: string
  diagnostico: Record<string, string>
  metaActiva?: { id: string; titulo: string; plazo: string; pasos: Paso[] } | null
}) {
  const [titulo, setTitulo]   = useState(metaActiva?.titulo ?? '')
  const [plazo, setPlazo]     = useState(metaActiva?.plazo ?? '3_meses')
  const [pasos, setPasos]     = useState<Paso[]>(metaActiva?.pasos ?? [])
  const [metaId, setMetaId]   = useState<string | null>(metaActiva?.id ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [editMode, setEditMode] = useState(!metaActiva)
  const supabase = createClient()

  async function generarPlan() {
    if (!titulo.trim()) { setError('Escribe tu meta primero'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generar-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meta: titulo, plazo, diagnostico }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const nuevosPasos: Paso[] = data.pasos ?? []
      setPasos(nuevosPasos)

      // Guardar en Supabase
      if (metaId) {
        await supabase.from('metas').update({
          titulo, plazo, pasos: nuevosPasos, updated_at: new Date().toISOString(),
        }).eq('id', metaId)
      } else {
        const { data: inserted } = await supabase.from('metas').insert({
          user_id: userId, titulo, plazo,
          fecha_limite: fechaLimite(plazo),
          pasos: nuevosPasos,
        }).select('id').single()
        if (inserted) setMetaId(inserted.id as string)
      }
      setEditMode(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      {/* Encabezado de sección */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="sec-tag" style={{ display: 'block', marginBottom: 4 }}>Mi meta principal</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'var(--brown)' }}>
            Plan con IA ✨
          </h3>
        </div>
        {!editMode && pasos.length > 0 && (
          <button
            onClick={() => setEditMode(true)}
            style={{ padding: '7px 18px', borderRadius: 20, border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer' }}
          >
            Editar meta
          </button>
        )}
      </div>

      {editMode && (
        <div className="card card-gold">
          <div className="review-q">
            <label>¿Cuál es tu meta principal?</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: Construir una rutina de mañana consistente"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: "'Lato', sans-serif" }}
            />
          </div>

          <div className="review-q" style={{ marginBottom: 12 }}>
            <label>Plazo para lograrlo:</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {PLAZOS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPlazo(p.value)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', border: '0.8px solid var(--cream2)',
                    background: plazo === p.value ? 'var(--rose)' : 'var(--white)',
                    color: plazo === p.value ? 'white' : 'var(--muted)',
                    transition: 'all .2s',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: 'rgba(181,112,106,.1)', borderRadius: 8, fontSize: 12, color: 'var(--rose)', marginBottom: 10 }}>
              {error}
            </div>
          )}

          <button
            className="save-btn"
            onClick={generarPlan}
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Generando tu plan... ✨' : 'Crear plan con IA ✨'}
          </button>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            La IA usará tus respuestas del diagnóstico para personalizar el plan.
          </p>
        </div>
      )}

      {pasos.length > 0 && !editMode && metaId && (
        <MetaCard titulo={titulo} plazo={plazo} pasos={pasos} metaId={metaId} userId={userId} />
      )}
    </div>
  )
}
