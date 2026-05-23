'use client'
import { useJournal } from '@/lib/hooks/useJournal'
import DiaryModal from './DiaryModal'

const PROMPTS = [
  '"¿Qué versión mía quiero honrar hoy?"',
  '"¿Qué emoción estoy cargando que aún no he nombrado?"',
  '"¿Qué estoy evitando hacer y por qué?"',
  '"¿Qué me diría Dios si pudiera hablarme directamente hoy?"',
  '"¿En qué área me he abandonado últimamente?"',
  '"¿Qué logros pequeños de esta semana merezco celebrar?"',
  '"¿Cuál es el miedo que más me paraliza y qué hay detrás de él?"',
  '"¿Qué necesito soltar para avanzar?"',
  '"¿Cómo quiero sentirme en 3 meses y qué necesito para llegar ahí?"',
  '"¿Qué me dice mi cuerpo hoy?"',
]

const EMOTIONS = ['😴 Agotada', '😰 Ansiosa', '😔 Triste', '😤 Frustrada', '😊 Bien', '✨ Muy bien', '🔥 Motivada', '🙏 Agradecida']

const ADVICE: Record<string, string> = {
  '😴 Agotada':    '🤍 Tu cuerpo te pide descanso. Hoy solo la rutina mínima — agua, oración y 1 tarea. Dormir temprano es productividad.',
  '😰 Ansiosa':    '🌬️ Haz la respiración 4-7-8 ahora mismo. Inhala 4 seg, sostén 7, exhala 8. Luego escribe qué específicamente te preocupa.',
  '😔 Triste':     '💙 Está bien sentirte así. No te exijas. Hoy sal 10 minutos al aire, escucha música de adoración y habla con Dios.',
  '😤 Frustrada':  '🔥 Tu frustración es señal de que te importa. Toma 5 minutos, escribe qué te frustró exactamente, y luego toma 1 acción pequeña.',
  '😊 Bien':       '✨ ¡Aprovecha esta energía! Haz tus tareas más importantes ahora y celebra esta versión tuya.',
  '✨ Muy bien':   '🌟 Estás en tu pico. Es el mejor momento para tu trabajo profundo y para ser generosa con tu energía.',
  '🔥 Motivada':   '🚀 ¡Canaliza esto! Escribe lo que quieres lograr en las próximas 3 horas y empieza sin dudar.',
  '🙏 Agradecida': '💛 Qué regalo estar aquí. Escribe hoy en tu journal desde este lugar — es cuando salen las palabras más poderosas.',
}

import { useState } from 'react'

export default function JournalBox({ userId }: { userId: string }) {
  const { texto, emocion, saving, changeTexto, changeEmocion, changePrompt } = useJournal(userId)
  const [promptIdx, setPromptIdx] = useState(0)
  const [showDiary, setShowDiary] = useState(false)

  function nextPrompt() {
    const next = (promptIdx + 1) % PROMPTS.length
    setPromptIdx(next)
    changePrompt(PROMPTS[next])
  }

  return (
    <>
      {showDiary && <DiaryModal userId={userId} onClose={() => setShowDiary(false)} />}

      {/* Termómetro emocional */}
      <div className="card card-rose">
        <h3>🌡️ ¿Cómo estoy hoy?</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 12px' }}>
          Toca cómo te sientes en este momento:
        </p>
        <div className="emotion-row">
          {EMOTIONS.map(e => (
            <button
              key={e}
              className={`emot-btn${emocion === e ? ' sel' : ''}`}
              onClick={() => changeEmocion(e)}
            >
              {e}
            </button>
          ))}
        </div>
        {emocion && ADVICE[emocion] && (
          <div className="tip-box">
            <p>{ADVICE[emocion]}</p>
          </div>
        )}
      </div>

      {/* Journaling guiado */}
      <div className="card card-sage" style={{ marginTop: 16 }}>
        <h3>✍️ Journaling guiado</h3>
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic',
            color: 'var(--brown)', marginBottom: 12, padding: 12,
            background: 'var(--cream)', borderRadius: 8, borderLeft: '3px solid var(--blush)',
          }}>
            {PROMPTS[promptIdx]}
          </div>
          <textarea
            className="journal-box"
            placeholder="Escribe sin filtro. Nadie te juzga aquí..."
            value={texto}
            onChange={e => changeTexto(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="save-btn" onClick={nextPrompt}>Nueva pregunta ↺</button>
            <button
              onClick={() => setShowDiary(true)}
              style={{ padding: '8px 18px', borderRadius: 20, border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: 12, fontWeight: 700, color: 'var(--brown)', cursor: 'pointer' }}
            >
              📖 Abrir diario
            </button>
            {saving && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Guardando...</span>}
          </div>
        </div>
      </div>
    </>
  )
}
