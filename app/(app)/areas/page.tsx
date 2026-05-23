export default function AreasPage() {
  const areas = [
    { emoji: '✝️', name: 'Espiritual',      desc: 'Devoción, fe, propósito profundo',         badge: 'badge-gold', label: 'Alta prioridad' },
    { emoji: '💪', name: 'Física',           desc: 'Cuerpo, movimiento, vitalidad',            badge: 'badge-rose', label: 'Esencial' },
    { emoji: '🧠', name: 'Mental',           desc: 'Claridad, aprendizaje, enfoque',           badge: 'badge-sage', label: 'Sostenible' },
    { emoji: '🤍', name: 'Emocional',        desc: 'Paz, regulación, autoestima',              badge: 'badge-rose', label: 'Prioridad' },
    { emoji: '💼', name: 'Profesional',      desc: 'Carrera, proyectos, propósito',            badge: 'badge-gold', label: 'Crecer' },
    { emoji: '💸', name: 'Financiera',       desc: 'Estabilidad, ahorro, ingresos',            badge: 'badge-gold', label: 'Construir' },
    { emoji: '✨', name: 'Imagen personal',  desc: 'Autocuidado, estilo, presencia',           badge: 'badge-rose', label: 'Cultivar' },
    { emoji: '🌿', name: 'Relaciones',       desc: 'Vínculos, límites, amor propio',           badge: 'badge-sage', label: 'Nutrir' },
    { emoji: '🎯', name: 'Productividad',    desc: 'Organización, metas, acción',              badge: 'badge-sage', label: 'Sistema' },
  ]

  const tabla = [
    { area: '✝️ Espiritual',  minimo: '5 min de oración',        semanal: '3 devocionales',              mensual: 'Terminar un libro bíblico' },
    { area: '💪 Física',      minimo: '10 min de movimiento',     semanal: '3 sesiones de ejercicio',     mensual: 'Consolidar rutina de movimiento' },
    { area: '🧠 Mental',      minimo: '10 páginas de lectura',    semanal: '1 tema nuevo aprendido',      mensual: '1 libro leído' },
    { area: '🤍 Emocional',   minimo: 'Journaling 5 min',         semanal: 'Revisar emociones 3x',        mensual: 'Patrón emocional identificado' },
    { area: '💼 Profesional', minimo: '1 tarea de carrera/día',   semanal: 'Avanzar en 1 proyecto',       mensual: 'Alcanzar 1 meta profesional' },
    { area: '💸 Financiera',  minimo: 'Registrar gastos',         semanal: 'Revisar presupuesto',         mensual: 'Ahorrar meta del mes' },
    { area: '✨ Imagen',      minimo: 'Rutina de skincare',        semanal: 'Cuidar aspecto 5/7 días',     mensual: 'Crear estilo personal' },
  ]

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 2</div>
        <h2>Sistema por <span className="script">áreas de vida</span></h2>
        <div className="sec-divider" />
        <p>Cada área tiene su propio ritmo. No tienes que trabajarlas todas al mismo tiempo — empieza donde más urge.</p>
      </div>

      <div className="g3">
        {areas.map(a => (
          <div key={a.name} className="area-card">
            <span className="emoji">{a.emoji}</span>
            <h4>{a.name}</h4>
            <p>{a.desc}</p>
            <span className={`area-badge ${a.badge}`}>{a.label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h3>📊 Mapa de objetivos por área</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--cream2)' }}>
              {['Área', 'Hábito mínimo', 'Meta semanal', 'Meta mensual'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--brown)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.map((row, i) => (
              <tr key={row.area} style={{ borderBottom: '0.5px solid var(--cream2)', background: i % 2 ? 'rgba(255,255,255,.5)' : 'transparent' }}>
                <td style={{ padding: '10px 12px', color: 'var(--brown)', fontWeight: 700 }}>{row.area}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{row.minimo}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{row.semanal}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{row.mensual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
