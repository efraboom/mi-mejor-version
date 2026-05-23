'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const WEEKDAYS = ['L','M','X','J','V','S','D']

const EMOCION_TERCERA: Record<string, string> = {
  '😴 Agotada':    'Te sentías agotada',
  '😰 Ansiosa':    'Te sentías ansiosa',
  '😔 Triste':     'Te sentías triste',
  '😤 Frustrada':  'Te sentías frustrada',
  '😊 Bien':       'Estabas bien',
  '✨ Muy bien':   'Estabas muy bien',
  '🔥 Motivada':   'Te sentías motivada',
  '🙏 Agradecida': 'Te sentías agradecida',
}

const EMOCION_COLOR: Record<string, string> = {
  '😴 Agotada':    '#b0b0b0',
  '😰 Ansiosa':    'var(--gold)',
  '😔 Triste':     'var(--sage)',
  '😤 Frustrada':  'var(--rose)',
  '😊 Bien':       '#6aaf6a',
  '✨ Muy bien':   'var(--gold2)',
  '🔥 Motivada':   'var(--blush)',
  '🙏 Agradecida': 'var(--sage2)',
}

type Entry = { texto: string | null; emocion: string | null }

function buildCalendar(year: number, month: number): (number | null)[] {
  const first  = new Date(year, month, 1)
  const last   = new Date(year, month + 1, 0).getDate()
  let offset   = first.getDay()
  if (offset === 0) offset = 7
  const cells: (number | null)[] = Array(offset - 1).fill(null)
  for (let d = 1; d <= last; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function formatDayLabel(year: number, month: number, day: number): string {
  const d = new Date(year, month, day)
  const weekday = d.toLocaleDateString('es', { weekday: 'long' })
  const mes     = d.toLocaleDateString('es', { month: 'long' })
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${mes} ${year}`
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function DiaryModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const now   = new Date()
  const [year, setYear]       = useState(now.getFullYear())
  const [month, setMonth]     = useState(now.getMonth())
  const [selected, setSelected] = useState<number | null>(now.getDate())
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const [loading, setLoading] = useState(false)
  const supabase              = createClient()

  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  useEffect(() => {
    setLoading(true)
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const last  = new Date(year, month + 1, 0).getDate()
    const end   = `${year}-${String(month + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`
    supabase.from('journal_entries')
      .select('fecha, texto, emocion')
      .eq('user_id', userId)
      .gte('fecha', start)
      .lte('fecha', end)
      .then(({ data }) => {
        const map: Record<string, Entry> = {}
        data?.forEach(e => { map[e.fecha] = { texto: e.texto, emocion: e.emocion } })
        setEntries(map)
        setLoading(false)
      })
  }, [userId, year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
    setSelected(null)
  }

  const cells       = buildCalendar(year, month)
  const selectedStr = selected ? toDateStr(year, month, selected) : null
  const entry       = selectedStr ? entries[selectedStr] : null

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(60,40,30,.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: 20,
          width: '100%', maxWidth: 560,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '0.5px solid var(--cream2)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--rose)', marginBottom: 2 }}>
              Tu historia
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'var(--brown)', margin: 0 }}>
              Mi Diario ✍️
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: '0.8px solid var(--cream2)', background: 'var(--cream)', fontSize: 16, cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Navegación mes */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 8px' }}>
            <button onClick={prevMonth} style={{ padding: '4px 12px', borderRadius: 16, border: '0.8px solid var(--cream2)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              ←
            </button>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: 'var(--brown)' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ padding: '4px 12px', borderRadius: 16, border: '0.8px solid var(--cream2)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              →
            </button>
          </div>

          {/* Calendario */}
          <div style={{ padding: '0 20px 16px' }}>
            {/* Cabecera días */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Celdas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const dateStr  = toDateStr(year, month, day)
                const hasEntry = !!entries[dateStr]
                const e        = entries[dateStr]
                const isToday  = dateStr === todayStr
                const isSel    = day === selected
                const dotColor = e?.emocion ? EMOCION_COLOR[e.emocion] : 'var(--cream2)'

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(day)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 2px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: isSel
                        ? 'var(--rose)' : isToday
                        ? 'rgba(212,168,160,.2)' : 'transparent',
                      minHeight: 44,
                      transition: 'background .15s',
                    }}
                  >
                    <span style={{
                      fontSize: 13, fontWeight: isSel || isToday ? 700 : 400,
                      color: isSel ? 'white' : isToday ? 'var(--rose)' : 'var(--brown)',
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>
                    {hasEntry
                      ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSel ? 'rgba(255,255,255,.8)' : dotColor, marginTop: 3 }} />
                      : <span style={{ width: 6, height: 6, marginTop: 3 }} />
                    }
                  </button>
                )
              })}
            </div>

            {loading && (
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', padding: '8px 0' }}>
                Cargando...
              </div>
            )}

            {/* Leyenda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Estados:</span>
              {Object.entries(EMOCION_COLOR).slice(0, 4).map(([emo, color]) => (
                <span key={emo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {emo.split(' ')[1]}
                </span>
              ))}
            </div>
          </div>

          {/* Entrada del día seleccionado */}
          {selected && (
            <div style={{
              margin: '0 20px 20px',
              padding: '16px 20px',
              background: entry ? 'var(--cream)' : 'rgba(0,0,0,.02)',
              borderRadius: 12,
              border: '0.8px solid var(--cream2)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 10 }}>
                {formatDayLabel(year, month, selected)}
              </div>

              {entry ? (
                <>
                  {entry.emocion && (
                    <span style={{
                      display: 'inline-block', marginBottom: 12,
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: EMOCION_COLOR[entry.emocion] + '22',
                      color: EMOCION_COLOR[entry.emocion],
                      border: `0.8px solid ${EMOCION_COLOR[entry.emocion]}55`,
                    }}>
                      {entry.emocion.split(' ')[0]} {EMOCION_TERCERA[entry.emocion] ?? entry.emocion}
                    </span>
                  )}
                  {entry.texto ? (
                    <p style={{
                      fontSize: 14, color: 'var(--brown)', lineHeight: 1.8,
                      fontFamily: "'Cormorant Garamond', serif",
                      whiteSpace: 'pre-wrap', margin: 0,
                    }}>
                      {entry.texto}
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>
                      Solo registraste tu estado de ánimo, sin texto escrito.
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '12px 0' }}>
                  {toDateStr(year, month, selected) === todayStr
                    ? '✍️ Hoy aún no has escrito. Cierra y escribe tu entrada de hoy.'
                    : 'No escribiste en este día.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
