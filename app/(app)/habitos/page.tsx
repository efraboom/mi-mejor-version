export default function HabitosPage() {
  const n1 = [
    { name: 'Tomar 1 vaso de agua al despertar',    info: '⏰ 6:00–7:00 am | ⏱ 30 segundos | 🏆 Recompensa: ✓ en tu tracker',          tags: ['Salud','Hidratación'] },
    { name: 'Oración de gratitud de 3 minutos',     info: '⏰ Al despertar | ⏱ 3 min | 🏆 Recompensa: sentir paz inmediata',            tags: ['Espiritual','Mañana'] },
    { name: 'Tender la cama al levantarse',         info: '⏰ Al despertar | ⏱ 2 min | 🏆 Recompensa: primera victoria del día',        tags: ['Productividad','Orden'] },
    { name: 'Escribir 1 intención del día',         info: '⏰ Mañana | ⏱ 2 min | 🏆 Recompensa: claridad mental',                       tags: ['Emocional','Claridad'] },
    { name: 'Apagar el celular 30 min antes de dormir', info: '⏰ Noche | ⏱ 0 esfuerzo | 🏆 Recompensa: mejor sueño',                   tags: ['Descanso','Mental'] },
  ]
  const n2 = [
    { name: 'Devocional con Biblia — 10 min',       info: '⏰ 6:30 am | ⏱ 10 min | 🏆 Recompensa: semana sin saltarlo = tiempo especial', tags: ['Espiritual'] },
    { name: 'Caminata o movimiento de 20 min',      info: '⏰ Mañana o tarde | ⏱ 20 min | 🏆 Recompensa: 5 seguidos = item de bienestar', tags: ['Física','Energía'] },
    { name: 'Journaling emocional — 5–10 min',      info: '⏰ Noche | ⏱ 10 min | 🏆 Recompensa: conocerte profundamente',                tags: ['Emocional','Salud mental'] },
    { name: 'Leer 10–15 páginas antes de dormir',   info: '⏰ Noche | ⏱ 15 min | 🏆 Recompensa: mente más aguda, menos ansiedad',        tags: ['Mental','Lectura'] },
    { name: 'Registrar gastos del día',             info: '⏰ Noche | ⏱ 5 min | 🏆 Recompensa: control real de tu dinero',               tags: ['Financiero','Consciencia'] },
  ]
  const n3 = [
    { name: 'Rutina de ejercicio estructurada — 30–45 min', info: '⏰ Mañana | ⏱ 45 min | 🏆 Recompensa: energía, cuerpo y mente transformados', tags: ['Física','Disciplina'] },
    { name: 'Bloque de trabajo profundo — 90 min',          info: '⏰ Pico de energía | ⏱ 90 min | 🏆 Recompensa: proyectos reales avanzando',     tags: ['Profesional','Foco'] },
    { name: 'Preparación de comidas saludables semanal',    info: '⏰ Domingo | ⏱ 60–90 min | 🏆 Recompensa: semana con más energía y dinero',     tags: ['Salud','Nutrición'] },
    { name: 'Revisión semanal completa',                    info: '⏰ Domingo noche | ⏱ 30–45 min | 🏆 Recompensa: vida diseñada con intención',   tags: ['Productividad','Reflexión'] },
  ]

  function Level({ num, title, sub, pill, pilClass, items, dotClass, lhClass }: {
    num: string; title: string; sub: string; pill: string; pilClass: string;
    items: { name: string; info: string; tags: string[] }[];
    dotClass: string; lhClass: string;
  }) {
    return (
      <div className="habit-level">
        <div className={`level-header ${lhClass}`}>
          <div className="lnum">{num}</div>
          <div>
            <h3>{title}</h3>
            <p>{sub}</p>
          </div>
          <span className={`pill ${pilClass}`}>{pill}</span>
        </div>
        {items.map(item => (
          <div key={item.name} className="habit-item">
            <div className={`habit-dot ${dotClass}`} />
            <div>
              <div className="hname">{item.name}</div>
              <div className="hinfo">{item.info}</div>
              {item.tags.map(t => <span key={t} className="htag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 3</div>
        <h2>Plan de <span className="script">hábitos progresivos</span></h2>
        <div className="sec-divider" />
        <p>No cambias de golpe. Construyes poco a poco. Cada nivel se consolida antes de pasar al siguiente.</p>
      </div>

      <Level num="01" lhClass="lh-1" dotClass="hd-sage" pilClass="pill-sage" pill="Semanas 1–3"
        title="Nivel 1 — Hábitos semilla 🌱" sub="Menos de 5 minutos. Sin excusas. Solo hacerlo." items={n1} />

      <div className="tip-box">
        <p>🛡️ <strong>Anti-abandono:</strong> Si fallas un día, al día siguiente simplemente empiezas de nuevo. No rompas la cadena, pero si se rompe — la reconstruyes. Una recaída no es fracaso.</p>
      </div>

      <Level num="02" lhClass="lh-2" dotClass="hd-gold" pilClass="pill-gold" pill="Semanas 4–8"
        title="Nivel 2 — Hábitos raíz 🌿" sub="10–20 minutos. Ya tienes base. Ahora profundizas." items={n2} />

      <Level num="03" lhClass="lh-3" dotClass="hd-rose" pilClass="pill-rose" pill="Semanas 9–12+"
        title="Nivel 3 — Hábitos árbol 🌳" sub="30+ minutos. Tu nueva identidad consolidada." items={n3} />
    </div>
  )
}
