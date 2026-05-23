'use client'
import { useState } from 'react'

const AFFIRMATIONS = [
  'Soy disciplinada, constante y capaz de construir la vida que deseo.',
  'Mi relación con Dios es mi mayor fortaleza y ancla.',
  'Cuido mi cuerpo con amor porque es el templo de mi espíritu.',
  'Soy suficiente hoy, y cada día me convierto en más.',
  'El dinero fluye hacia mí cuando actúo con sabiduría e intención.',
  'Mis emociones son válidas y tengo las herramientas para manejarlas.',
  'Soy una mujer equilibrada, plena y en crecimiento continuo.',
  'No necesito ser perfecta. Solo necesito ser constante.',
  'Dios tiene planes de bien para mí. Confío en Su guía.',
  'Cada pequeño hábito que sostengo es una victoria que acumulo.',
  'Mi mejor versión no es un destino — es quien elijo ser hoy.',
]

export default function Affirmations() {
  const [idx, setIdx] = useState(0)

  return (
    <>
      <div className="affirm-card">
        <p>{AFFIRMATIONS[idx]}</p>
        <small>✦ Lee en voz alta cada mañana ✦</small>
      </div>
      <div className="affirm-nav">
        <button onClick={() => setIdx(i => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length)}>← Anterior</button>
        <button onClick={() => setIdx(i => (i + 1) % AFFIRMATIONS.length)}>Siguiente →</button>
      </div>
    </>
  )
}
