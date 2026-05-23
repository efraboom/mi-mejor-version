'use client'
import { useState } from 'react'

function TimeBlock({ time, emoji, title, desc }: { time: string; emoji: string; title: string; desc: string }) {
  return (
    <div className="time-block">
      <div className="time-label">{time}</div>
      <div className="time-line" />
      <div className="time-content">
        <span className="tc-emoji">{emoji}</span>
        <span className="tc-title">{title}</span>
        <div className="tc-desc">{desc}</div>
      </div>
    </div>
  )
}

const MANANA = [
  { time: '6:00 am', emoji: '🙏', title: 'Oración y gratitud', desc: '3 cosas por las que agradecer. Entregar el día a Dios.' },
  { time: '6:10 am', emoji: '💧', title: 'Agua + limón', desc: 'Activar el metabolismo. Tender la cama.' },
  { time: '6:20 am', emoji: '📖', title: 'Devocional — 10 min', desc: 'Biblia, reflexión, escuchar a Dios.' },
  { time: '6:35 am', emoji: '💪', title: 'Movimiento / Ejercicio — 30 min', desc: 'Caminata, yoga, entreno. Lo que el cuerpo pida.' },
  { time: '7:10 am', emoji: '🚿', title: 'Ducha + skincare + arreglo personal', desc: 'Verte bien para sentirte bien. Autocuidado con intención.' },
  { time: '7:40 am', emoji: '🥣', title: 'Desayuno nutritivo sin pantallas', desc: 'Come presente. Sin celular. Solo tú y tu desayuno.' },
  { time: '8:00 am', emoji: '📝', title: 'Planificación del día — 5 min', desc: 'Mis 3 tareas más importantes. Mi intención de hoy.' },
]
const PRODUCTIVIDAD = [
  { time: '8:15 am', emoji: '🎯', title: 'Bloque profundo 1 — 90 min', desc: 'Tarea más importante. Sin distracciones. Modo avión.' },
  { time: '9:45 am', emoji: '☕', title: 'Descanso activo — 15 min', desc: 'Caminar, estirar, respirar. No redes sociales.' },
  { time: '10:00 am', emoji: '💼', title: 'Bloque profundo 2 — 60–90 min', desc: 'Proyectos, estudio, trabajo creativo.' },
  { time: '12:00 pm', emoji: '🥗', title: 'Almuerzo + descanso real — 60 min', desc: 'Come con calma. Sal si puedes. Recarga energía.' },
  { time: '1:00 pm', emoji: '📊', title: 'Tareas secundarias / emails / admin — 90 min', desc: 'Lo que no requiere máxima concentración.' },
]
const NOCHE = [
  { time: '6:00 pm', emoji: '🏁', title: 'Cierre de trabajo — 5 min', desc: 'Anotar pendientes para mañana. Desconectar conscientemente.' },
  { time: '7:00 pm', emoji: '💸', title: 'Registro de gastos — 5 min', desc: '¿Cuánto gasté hoy? ¿En qué? Sin juicio, solo conciencia.' },
  { time: '8:00 pm', emoji: '✍️', title: 'Journaling — 10 min', desc: '¿Cómo me sentí hoy? ¿Qué aprendí? ¿Qué agradezco?' },
  { time: '8:15 pm', emoji: '📚', title: 'Lectura — 20 min', desc: 'Sin pantallas. Tu mente descansando en buenas palabras.' },
  { time: '9:00 pm', emoji: '🙏', title: 'Oración de cierre', desc: 'Entregar el día. Perdonar. Confiar. Descansar en Dios.' },
  { time: '9:30 pm', emoji: '😴', title: 'Dormir — objetivo 7–8 h', desc: 'El sueño es sagrado. Celébralo, no lo sacrifiques.' },
]
const DIFICIL = [
  { time: 'Mañana',       emoji: '🙏', title: 'Solo 3 minutos con Dios', desc: '"Señor, hoy estoy cansada. Acompáñame." Eso es suficiente.' },
  { time: 'Mañana',       emoji: '💧', title: 'Agua y 1 alimento nutritivo', desc: 'Tu cuerpo necesita apoyo, no castigo.' },
  { time: 'Durante el día', emoji: '🎯', title: 'Solo 1 tarea importante', desc: 'No la lista completa. Solo una. La que más importa hoy.' },
  { time: 'Tarde',        emoji: '🚶', title: '10 minutos de aire fresco', desc: 'Sal aunque sea al balcón. Respira. Recuerda que eres humana.' },
  { time: 'Noche',        emoji: '✍️', title: 'Escribe solo: "Hoy me sentí ___"', desc: 'No necesitas resolver nada. Solo nombrar lo que sientes.' },
  { time: 'Noche',        emoji: '😴', title: 'Dormir temprano sin culpa', desc: 'El descanso es productividad. Mañana empieza de nuevo.' },
]

export default function RutinaPage() {
  const [modo, setModo] = useState<'bueno' | 'dificil'>('bueno')

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 4</div>
        <h2>Rutina diaria <span className="script">equilibrada</span></h2>
        <div className="sec-divider" />
        <p>Diseñada para días buenos y días difíciles. Siempre hay una versión para ti.</p>
      </div>

      <div className="day-toggle">
        <button className={`dtog${modo === 'bueno' ? ' on' : ''}`} onClick={() => setModo('bueno')}>☀️ Día bueno</button>
        <button className={`dtog${modo === 'dificil' ? ' on' : ''}`} onClick={() => setModo('dificil')}>🌧️ Día difícil</button>
      </div>

      {modo === 'bueno' ? (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>🌅 Rutina de mañana</h3>
            <div style={{ marginTop: 16 }}>{MANANA.map(b => <TimeBlock key={b.title} {...b} />)}</div>
          </div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>🌞 Bloques de productividad</h3>
            <div style={{ marginTop: 16 }}>{PRODUCTIVIDAD.map(b => <TimeBlock key={b.title} {...b} />)}</div>
          </div>
          <div className="card">
            <h3>🌙 Rutina de noche</h3>
            <div style={{ marginTop: 16 }}>{NOCHE.map(b => <TimeBlock key={b.title} {...b} />)}</div>
          </div>
        </>
      ) : (
        <>
          <div className="tip-box" style={{ marginBottom: 20 }}>
            <p>🤍 <strong>En días difíciles la meta no es ser perfecta — es ser compasiva contigo.</strong> Esta rutina mínima te mantiene anclada sin agotarte.</p>
          </div>
          <div className="card">
            <h3>💛 Rutina mínima para días difíciles</h3>
            <div style={{ marginTop: 16 }}>{DIFICIL.map(b => <TimeBlock key={b.title} {...b} />)}</div>
          </div>
          <div className="affirm-card" style={{ marginTop: 16 }}>
            <p>"Caí, pero no me quedé en el suelo. Eso ya es valentía."</p>
            <small>✦ Para días difíciles ✦</small>
          </div>
        </>
      )}
    </div>
  )
}
