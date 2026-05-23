'use client'
import { Fragment } from 'react'
import { useTracker, isFutureDay } from '@/lib/hooks/useTracker'
import { useChecklist } from '@/lib/hooks/useChecklist'

const HABITS = [
  '🙏 Oración / Devocional',
  '💧 Tomar agua (2L)',
  '💪 Movimiento / Ejercicio',
  '✍️ Journaling',
  '📚 Lectura',
  '💸 Registro de gastos',
  '😴 Dormir a tiempo',
  '✨ Skincare / Autocuidado',
]

const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const DAILY = [
  { emoji: '💧', text: 'Agua al despertar' },
  { emoji: '🙏', text: 'Oración matutina' },
  { emoji: '🛏️', text: 'Tender la cama' },
  { emoji: '💪', text: 'Movimiento del día' },
  { emoji: '🥗', text: 'Comer nutritivo' },
  { emoji: '📝', text: 'Tareas importantes' },
  { emoji: '✍️', text: 'Journaling' },
  { emoji: '📚', text: 'Lectura' },
  { emoji: '💸', text: 'Registrar gastos' },
  { emoji: '🙏', text: 'Oración de cierre' },
]

function getWeekDates(weekStart: string): Date[] {
  const d = new Date(weekStart + 'T12:00:00')
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    return day
  })
}

function weekLabel(weekStart: string): string {
  const dates = getWeekDates(weekStart)
  const start = dates[0]
  const end   = dates[6]
  const month = end.toLocaleDateString('es', { month: 'long' })
  const year  = end.getFullYear()
  return `${start.getDate()} – ${end.getDate()} de ${month} ${year}`
}

export default function HabitTracker({ userId }: { userId: string }) {
  const tracker   = useTracker(userId)
  const checklist = useChecklist(userId)

  const isCurrentWeek = tracker.weekStart === tracker.currentWeekStart
  const weekDates     = getWeekDates(tracker.weekStart)
  const total = HABITS.length * 7
  const done  = Object.values(tracker.state).filter(Boolean).length

  if (tracker.loading) return (
    <div style={{ color: 'var(--muted)', padding: '20px', textAlign: 'center' }}>
      Cargando tracker...
    </div>
  )

  return (
    <>
      {/* Tracker grid */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        {/* Navegación de semana */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '0.5px solid var(--cream2)', flexWrap: 'wrap', gap: 8,
        }}>
          <button
            onClick={tracker.goPrevWeek}
            style={{ padding: '6px 14px', borderRadius: 20, border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer' }}
          >
            ← Anterior
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown)' }}>
              {weekLabel(tracker.weekStart)}
            </div>
            {!isCurrentWeek && (
              <button
                onClick={tracker.goCurrentWeek}
                style={{ marginTop: 4, padding: '3px 12px', borderRadius: 20, border: 'none', background: 'var(--rose)', fontSize: 11, fontWeight: 700, color: 'white', cursor: 'pointer' }}
              >
                Volver a hoy
              </button>
            )}
          </div>

          <button
            onClick={tracker.goNextWeek}
            style={{ padding: '6px 14px', borderRadius: 20, border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer' }}
          >
            Siguiente semana →
          </button>
        </div>

        <div className="tracker-grid">
          <div className="tg-header">Hábito</div>
          {weekDates.map((date, di) => {
            const future = isFutureDay(tracker.weekStart, di)
            return (
              <div key={di} className="tg-header" style={{ opacity: future ? 0.4 : 1 }}>
                <div>{DAY_LETTERS[di]}</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginTop: 2 }}>
                  {date.getDate()}
                </div>
              </div>
            )
          })}

          {HABITS.map((h, hi) => (
            <Fragment key={hi}>
              <div className="tg-habit">{h}</div>
              {weekDates.map((_, di) => {
                const key    = `${hi}-${di}`
                const isDone = tracker.state[key]
                const future = isFutureDay(tracker.weekStart, di)
                return (
                  <div
                    key={key}
                    className="tg-cell"
                    onClick={() => !future && tracker.toggle(hi, di)}
                    style={{ cursor: future ? 'not-allowed' : 'pointer', opacity: future ? 0.35 : 1 }}
                  >
                    <div className={`check-box${isDone ? ' done' : ''}`}>
                      {isDone ? '✓' : ''}
                    </div>
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>

        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            {done} / {total} completados esta semana
          </span>
        </div>
      </div>

      {/* Checklist diaria */}
      <div className="card card-rose" style={{ marginTop: '20px' }}>
        <h3>✅ Checklist diaria</h3>
        <div style={{ marginTop: '12px' }}>
          {DAILY.map((item, i) => {
            const checked = checklist.state[i]
            return (
              <div
                key={i}
                onClick={() => checklist.toggle(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 0', borderBottom: '0.5px solid var(--cream2)', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: '1.5px solid var(--cream2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, flexShrink: 0,
                  background: checked ? 'var(--sage)' : 'transparent',
                  borderColor: checked ? 'var(--sage)' : 'var(--cream2)',
                  color: checked ? 'white' : 'transparent',
                }}>
                  {checked ? '✓' : ''}
                </div>
                <span style={{
                  fontSize: 13,
                  color: checked ? 'var(--muted)' : 'var(--brown)',
                  textDecoration: checked ? 'line-through' : 'none',
                }}>
                  {item.emoji} {item.text}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
