'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart } from '@/lib/hooks/useTracker'
import { FRASES } from '@/lib/constants/frases'

/* ─── types ─── */
type Tab = 'diario' | 'semanal' | 'mensual' | 'anual'
type Scores = Record<string, number>
type TEntry = { habit_index: number; day_index: number; completed: boolean; week_start: string }

const AREA_H: Record<string, number[]> = {
  esp:[0], fis:[1,2], men:[3,4], emo:[3,6], pro:[4,5], fin:[5],
}

const AREA_CFG = [
  { id:'esp', label:'✝️ Espiritual',  color:'#c9a96e' },
  { id:'fis', label:'💪 Física',       color:'#b5706a' },
  { id:'men', label:'🧠 Mental',       color:'#8fa68c' },
  { id:'emo', label:'🤍 Emocional',    color:'#d4a8a0' },
  { id:'pro', label:'💼 Profesional',  color:'#c9a96e' },
  { id:'fin', label:'💸 Financiera',   color:'#8fa68c' },
]

const HABITS = ['🙏 Oración','💧 Agua','💪 Ejercicio','✍️ Journaling','📚 Lectura','💸 Gastos','😴 Dormir','✨ Skincare']
const DAYS   = ['L','M','X','J','V','S','D']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const EMO_COLOR: Record<string, string> = {
  '😴 Agotada':'#b0b0b0','😰 Ansiosa':'#c9a96e','😔 Triste':'#8fa68c',
  '😤 Frustrada':'#b5706a','😊 Bien':'#6aaf6a','✨ Muy bien':'#d4a850',
  '🔥 Motivada':'#d4a8a0','🙏 Agradecida':'#8fa68c',
}

/* ─── helpers ─── */
function todayStr() { return new Date().toISOString().split('T')[0] }
function todayDayIdx() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 }

/** Calcula scores de área desde entradas reales de tracker (1 semana de base) */
function calcAreaScores(entries: TEntry[]): Scores {
  const s: Scores = { esp:0, fis:0, men:0, emo:0, pro:0, fin:0 }
  Object.entries(AREA_H).forEach(([area, indices]) => {
    const total = indices.length * 7
    const done  = entries.filter(e => indices.includes(e.habit_index) && e.completed).length
    s[area] = total > 0 ? Math.round((done / total) * 100) : 0
  })
  return s
}

/** Promedia scores de múltiples semanas */
function avgAreaScores(byWeek: Record<string, TEntry[]>): Scores {
  const weeks = Object.values(byWeek)
  if (!weeks.length) return { esp:0, fis:0, men:0, emo:0, pro:0, fin:0 }
  const totals: Scores = { esp:0, fis:0, men:0, emo:0, pro:0, fin:0 }
  weeks.forEach(w => { const s = calcAreaScores(w); Object.keys(totals).forEach(k => { totals[k] += s[k] }) })
  Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] / weeks.length) })
  return totals
}

function groupByWeek(entries: TEntry[]): Record<string, TEntry[]> {
  const g: Record<string, TEntry[]> = {}
  entries.forEach(e => { if (!g[e.week_start]) g[e.week_start] = []; g[e.week_start].push(e) })
  return g
}

/* ─── animated radial ring ─── */
function RadialRing({ value, color, label, size=90 }: { value:number; color:string; label:string; size?:number }) {
  const [v, setV] = useState(0)
  useEffect(() => { const t = setTimeout(() => setV(value), 120); return () => clearTimeout(t) }, [value])
  const r = size * 0.38; const circ = 2 * Math.PI * r
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--cream2)" strokeWidth={size*0.09} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
          strokeDasharray={`${(v/100)*circ} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          fontSize={size*0.19} fontWeight="700" fill={color} fontFamily="Lato,sans-serif">{v}%</text>
      </svg>
      <span style={{ fontSize:10, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, textAlign:'center' }}>{label}</span>
    </div>
  )
}

/* ─── horizontal bar ─── */
function HBar({ label, value, color, delay=0 }: { label:string; value:number; color:string; delay?:number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 80+delay); return () => clearTimeout(t) }, [value])
  return (
    <div className="prog-item">
      <div className="prog-label"><span>{label}</span><span style={{ color }}>{value}%</span></div>
      <div className="prog-bar">
        <div style={{ height:'100%', width:`${w}%`, background:color, borderRadius:4, transition:`width 1.1s cubic-bezier(.4,0,.2,1) ${delay}ms` }} />
      </div>
    </div>
  )
}

/* ─── vertical bar ─── */
function VBar({ pct, dayLabel, dateNum, color, delay=0, isToday=false }:
  { pct:number; dayLabel:string; dateNum:number; color:string; delay?:number; isToday?:boolean }) {
  const [h, setH] = useState(0)
  useEffect(() => { const t = setTimeout(() => setH(pct), 80+delay); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <div style={{ width:'100%', height:72, display:'flex', alignItems:'flex-end', justifyContent:'center', position:'relative' }}>
        {pct > 0 && <span style={{ position:'absolute', top:0, fontSize:9, color:isToday?'var(--rose)':'var(--muted)', fontWeight:700 }}>{pct}%</span>}
        <div style={{
          width:'70%', minHeight: h>0?4:0, height:`${h*0.68}px`,
          background: isToday ? 'var(--rose)' : color,
          borderRadius:'4px 4px 0 0',
          transition:`height .9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:isToday?'var(--rose)':'var(--brown)' }}>{dayLabel}</span>
      <span style={{ fontSize:10, color:'var(--muted)' }}>{dateNum}</span>
    </div>
  )
}

/* ─── mood chip ─── */
function MoodChip({ emocion }: { emocion:string|null }) {
  if (!emocion) return <span style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic' }}>Sin registrar</span>
  const color = EMO_COLOR[emocion] ?? 'var(--muted)'
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background:color+'20', color, border:`0.8px solid ${color}55` }}>
      {emocion}
    </span>
  )
}

/* ─── empty state ─── */
function EmptyState({ msg }: { msg:string }) {
  return (
    <div style={{ textAlign:'center', padding:'28px 16px', color:'var(--muted)', fontSize:13, fontStyle:'italic', background:'var(--cream)', borderRadius:10 }}>
      {msg}
    </div>
  )
}

/* ═══════════════════════════════════════════ */
export default function ProgressDashboard({ userId }: { userId:string }) {
  const supabase  = createClient()
  const weekStart = getWeekStart()
  const today     = todayStr()
  const todayIdx  = todayDayIdx()
  const now       = new Date()

  /* phrase rotation */
  const [phraseIdx, setPhraseIdx]   = useState(0)
  const [phraseVisible, setVisible] = useState(true)
  useEffect(() => {
    setPhraseIdx(Math.floor(Math.random()*FRASES.length))
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setPhraseIdx(i => (i+1)%FRASES.length); setVisible(true) }, 400)
    }, 7000)
    return () => clearInterval(iv)
  }, [])

  const [tab, setTab]           = useState<Tab>('diario')
  const [loadedTabs, setLoaded] = useState<Set<Tab>>(new Set())

  /* ── diario ── */
  const [dHabits,   setDHabits]   = useState<boolean[]>(Array(8).fill(false))
  const [dMood,     setDMood]     = useState<string|null>(null)
  const [dTexto,    setDTexto]    = useState<string|null>(null)
  const [dGratitud, setDGratitud] = useState<string[]>([])
  const [dScores,   setDScores]   = useState<Scores>({ esp:0,fis:0,men:0,emo:0,pro:0,fin:0 })

  /* ── semanal ── */
  const [wPct,    setWPct]    = useState<number[]>(Array(7).fill(0))
  const [wMoods,  setWMoods]  = useState<(string|null)[]>(Array(7).fill(null))
  const [wScores, setWScores] = useState<Scores>({ esp:0,fis:0,men:0,emo:0,pro:0,fin:0 })
  const [wReview, setWReview] = useState<{celebro?:string;resumen_ia?:string}|null>(null)

  /* ── mensual ── */
  const [mWeeks,  setMWeeks]  = useState<{label:string;pct:number}[]>([])
  const [mMoods,  setMMoods]  = useState<Record<string,number>>({})
  const [mScores, setMScores] = useState<Scores>({ esp:0,fis:0,men:0,emo:0,pro:0,fin:0 })

  /* ── anual ── */
  const [aScores,    setAScores]    = useState<Scores>({ esp:0,fis:0,men:0,emo:0,pro:0,fin:0 })
  const [aWeekCount, setAWeekCount] = useState(0)

  /* ─────── loaders ─────── */
  const loadDiario = useCallback(async () => {
    const [tracker, journal, gratitud] = await Promise.all([
      supabase.from('tracker_entries').select('habit_index,day_index,completed,week_start')
        .eq('user_id',userId).eq('week_start',weekStart),
      supabase.from('journal_entries').select('emocion,texto')
        .eq('user_id',userId).eq('fecha',today).maybeSingle(),
      supabase.from('gratitud_entries').select('item1,item2,item3')
        .eq('user_id',userId).eq('fecha',today).maybeSingle(),
    ])
    const entries = (tracker.data ?? []) as TEntry[]
    // today's habits
    const h = Array(8).fill(false)
    entries.filter(e => e.day_index === todayIdx && e.completed).forEach(e => { h[e.habit_index] = true })
    setDHabits(h)
    // area scores from THIS WEEK only
    setDScores(calcAreaScores(entries))
    // journal
    const j = journal.data as {emocion?:string|null;texto?:string|null}|null
    setDMood(j?.emocion ?? null)
    setDTexto(j?.texto ?? null)
    // gratitud
    const g = gratitud.data as {item1?:string|null;item2?:string|null;item3?:string|null}|null
    setDGratitud(g ? [g.item1,g.item2,g.item3].filter(Boolean) as string[] : [])
  }, [userId, weekStart, today, todayIdx])

  const loadSemanal = useCallback(async () => {
    const weekEnd = (() => { const d=new Date(weekStart+'T12:00:00'); d.setDate(d.getDate()+6); return d.toISOString().split('T')[0] })()
    const [tracker, journal, review] = await Promise.all([
      supabase.from('tracker_entries').select('habit_index,day_index,completed,week_start')
        .eq('user_id',userId).eq('week_start',weekStart),
      supabase.from('journal_entries').select('fecha,emocion')
        .eq('user_id',userId).gte('fecha',weekStart).lte('fecha',weekEnd),
      supabase.from('weekly_reviews').select('celebro,resumen_ia')
        .eq('user_id',userId).eq('week_start',weekStart).maybeSingle(),
    ])
    const entries = (tracker.data ?? []) as TEntry[]
    // pct per day
    const counts = Array(7).fill(0)
    entries.filter(e => e.completed).forEach(e => { counts[e.day_index]++ })
    // Only show % for days that have passed (≤ todayIdx)
    setWPct(counts.map((c,i) => i <= todayIdx ? Math.round((c/8)*100) : 0))
    // scores from this week's actual data
    setWScores(calcAreaScores(entries))
    // moods
    const moodMap: Record<string,string> = {}
    ;(journal.data ?? []).forEach((e:any) => { if (e.emocion) moodMap[e.fecha] = e.emocion })
    const start = new Date(weekStart+'T12:00:00')
    setWMoods(Array(7).fill(0).map((_,i) => {
      const d = new Date(start); d.setDate(start.getDate()+i)
      return moodMap[d.toISOString().split('T')[0]] ?? null
    }))
    setWReview(review.data as any)
  }, [userId, weekStart, todayIdx])

  const loadMensual = useCallback(async () => {
    const y=now.getFullYear(), m=now.getMonth()
    const mStart = `${y}-${String(m+1).padStart(2,'0')}-01`
    const mEnd   = `${y}-${String(m+1).padStart(2,'0')}-${new Date(y,m+1,0).getDate()}`
    const [tracker, journal] = await Promise.all([
      supabase.from('tracker_entries').select('habit_index,day_index,completed,week_start')
        .eq('user_id',userId).gte('week_start',mStart).lte('week_start',mEnd),
      supabase.from('journal_entries').select('emocion')
        .eq('user_id',userId).gte('fecha',mStart).lte('fecha',mEnd).not('emocion','is',null),
    ])
    const entries = (tracker.data ?? []) as TEntry[]
    const byWeek  = groupByWeek(entries)
    const wStarts = Object.keys(byWeek).sort()

    // Per-week completion % using correct denominator
    const weeks = wStarts.map((ws, i) => {
      const wEntries = byWeek[ws]
      const isCurrentWeek = ws === weekStart
      // For current week: only count days up to today
      const daysInWeek   = isCurrentWeek ? todayIdx + 1 : 7
      const possible     = daysInWeek * 8
      const done         = wEntries.filter(e => e.completed && (isCurrentWeek ? e.day_index <= todayIdx : true)).length
      return { label:`Sem ${i+1}`, pct: possible > 0 ? Math.round((done/possible)*100) : 0 }
    })
    setMWeeks(weeks)

    // Average area scores across weeks this month
    setMScores(weeks.length > 0 ? avgAreaScores(byWeek) : { esp:0,fis:0,men:0,emo:0,pro:0,fin:0 })

    // Mood distribution
    const dist: Record<string,number> = {}
    ;(journal.data ?? []).forEach((e:any) => { if (e.emocion) dist[e.emocion]=(dist[e.emocion]??0)+1 })
    setMMoods(dist)
  }, [userId, weekStart, todayIdx])

  const loadAnual = useCallback(async () => {
    const yearStart = `${now.getFullYear()}-01-01`
    const { data } = await supabase.from('tracker_entries')
      .select('habit_index,day_index,completed,week_start')
      .eq('user_id',userId).gte('week_start',yearStart)
    const entries  = (data ?? []) as TEntry[]
    const byWeek   = groupByWeek(entries)
    const wCount   = Object.keys(byWeek).length
    setAWeekCount(wCount)
    if (wCount >= 2) setAScores(avgAreaScores(byWeek))
  }, [userId])

  useEffect(() => {
    if (!loadedTabs.has(tab)) {
      if (tab==='diario')  loadDiario()
      if (tab==='semanal') { loadSemanal(); if(!loadedTabs.has('diario')) loadDiario() }
      if (tab==='mensual') loadMensual()
      if (tab==='anual')   loadAnual()
      setLoaded(prev => new Set([...prev, tab]))
    }
  }, [tab])

  useEffect(() => { loadDiario() }, [])

  /* totales */
  const totalDiario  = Math.round(Object.values(dScores).reduce((a,b)=>a+b,0)/6)
  const totalSemanal = Math.round(Object.values(wScores).reduce((a,b)=>a+b,0)/6)
  const todayDone    = dHabits.filter(Boolean).length

  /* tab style */
  const tabStyle = (t: Tab) => ({
    flex:1, padding:'10px 4px', border:'none', background:'transparent', cursor:'pointer',
    fontSize:12, fontWeight:700, letterSpacing:0.5,
    color: tab===t ? 'var(--brown)' : 'var(--muted)',
    borderBottom: tab===t ? '2px solid var(--rose)' : '2px solid transparent',
    transition:'all .2s',
  })

  /* ─── render ─── */
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Frase rotante */}
      <div style={{
        textAlign:'center', padding:'20px 24px',
        background:'linear-gradient(135deg,rgba(212,168,160,.1),rgba(201,169,110,.08))',
        border:'0.8px solid rgba(201,169,110,.25)', borderRadius:14,
        opacity: phraseVisible ? 1 : 0, transition:'opacity .4s ease',
      }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:'italic', color:'var(--brown)', lineHeight:1.6, marginBottom:6 }}>
          "{FRASES[phraseIdx]}"
        </div>
        <div style={{ fontSize:10, letterSpacing:3, color:'var(--gold)', textTransform:'uppercase' }}>✦ Mi Mejor Versión ✦</div>
      </div>

      {/* Resumen rápido hoy */}
      <div style={{ display:'flex', alignItems:'center', gap:20, padding:'16px 20px', background:'var(--cream)', borderRadius:14, border:'0.8px solid var(--cream2)' }}>
        <RadialRing value={totalDiario} color="var(--rose)" label="Esta semana" size={78} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:'var(--muted)', textTransform:'uppercase', marginBottom:4 }}>Hoy · {new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'})}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'var(--brown)' }}>
            {todayDone}/8 hábitos completados
          </div>
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>
            {todayDone >= 7 ? '¡Día excepcional! 🔥' : todayDone >= 5 ? 'Gran avance 💪' : todayDone >= 3 ? 'Buen comienzo ✨' : 'Empieza hoy, hermosa 🌸'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'flex', borderBottom:'0.5px solid var(--cream2)' }}>
          {(['diario','semanal','mensual','anual'] as Tab[]).map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ padding:'20px' }}>

          {/* ══ DIARIO ══ */}
          {tab==='diario' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:12 }}>Hábitos de hoy</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
                  {HABITS.map((h,i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:10,
                      background: dHabits[i] ? 'rgba(143,166,140,.15)' : 'var(--cream)',
                      border:`0.8px solid ${dHabits[i]?'var(--sage)':'var(--cream2)'}`, transition:'all .3s',
                    }}>
                      <span style={{ fontSize:18, lineHeight:1 }}>{dHabits[i]?'✅':'⬜'}</span>
                      <span style={{ fontSize:12, color:dHabits[i]?'var(--sage2)':'var(--muted)', fontWeight:dHabits[i]?700:400 }}>
                        {h.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:8 }}>Estado de ánimo</div>
                  <MoodChip emocion={dMood} />
                  {dTexto && <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7, marginTop:8, fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic' }}>"{dTexto.slice(0,120)}{dTexto.length>120?'...':''}"</p>}
                </div>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:8 }}>Gratitud de hoy</div>
                  {dGratitud.length > 0
                    ? dGratitud.map((g,i) => <div key={i} style={{ fontSize:12, color:'var(--muted)', padding:'4px 0', borderBottom:'0.5px solid var(--cream2)' }}>✦ {g}</div>)
                    : <span style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic' }}>Aún no registrada</span>
                  }
                </div>
              </div>

              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:4 }}>Progreso por área <span style={{ fontSize:11, color:'var(--muted)', fontWeight:400 }}>(semana actual)</span></div>
                <div style={{ fontSize:11, color:'var(--muted)', marginBottom:10 }}>Basado en {todayIdx+1} día{todayIdx>0?'s':''} de esta semana</div>
                {AREA_CFG.map((a,i) => <HBar key={a.id} label={a.label} value={dScores[a.id]??0} color={a.color} delay={i*80} />)}
              </div>
            </div>
          )}

          {/* ══ SEMANAL ══ */}
          {tab==='semanal' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'var(--muted)', textTransform:'uppercase' }}>
                Semana del {new Date(weekStart+'T12:00:00').toLocaleDateString('es',{day:'numeric',month:'long'})} · {todayIdx+1} de 7 días
              </div>

              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:4 }}>Progreso por área</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginBottom:10 }}>Calculado sobre {todayIdx+1} día{todayIdx>0?'s':''} completados de 7</div>
                {AREA_CFG.map((a,i) => <HBar key={a.id} label={a.label} value={wScores[a.id]??0} color={a.color} delay={i*80} />)}
              </div>

              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:16 }}>Hábitos completados por día</div>
                <div style={{ display:'flex', gap:4, alignItems:'flex-end' }}>
                  {DAYS.map((d,i) => {
                    const dayDate = new Date(weekStart+'T12:00:00'); dayDate.setDate(dayDate.getDate()+i)
                    const isToday = i === todayIdx
                    const isFuture = i > todayIdx
                    return (
                      <VBar key={i}
                        pct={isFuture ? 0 : wPct[i]}
                        dayLabel={d}
                        dateNum={dayDate.getDate()}
                        color={AREA_CFG[1].color}
                        delay={i*80}
                        isToday={isToday}
                      />
                    )
                  })}
                </div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>Las barras vacías son días que aún no han llegado.</div>
              </div>

              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:10 }}>Estado esta semana</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {DAYS.map((d,i) => {
                    const dayDate = new Date(weekStart+'T12:00:00'); dayDate.setDate(dayDate.getDate()+i)
                    const isToday = i === todayIdx; const isFuture = i > todayIdx
                    return (
                      <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity:isFuture?0.3:1 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:isToday?'var(--rose)':'var(--muted)' }}>{d} {dayDate.getDate()}</span>
                        {wMoods[i]
                          ? <span style={{ fontSize:20 }} title={wMoods[i]!}>{wMoods[i]!.split(' ')[0]}</span>
                          : <span style={{ fontSize:14, color:'var(--cream2)' }}>—</span>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>

              {wReview?.resumen_ia
                ? <div style={{ padding:'14px 16px', background:'rgba(201,169,110,.08)', border:'0.8px solid rgba(201,169,110,.3)', borderLeft:'3px solid var(--gold)', borderRadius:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--gold)', marginBottom:6, letterSpacing:1 }}>✨ Tu resumen de la semana</div>
                    <p style={{ fontSize:13, color:'var(--brown)', lineHeight:1.7, fontFamily:"'Cormorant Garamond',serif", margin:0, fontStyle:'italic' }}>{wReview.resumen_ia}</p>
                  </div>
                : <EmptyState msg="Completa tu revisión semanal en la sección 'Sistema semanal' para ver el resumen aquí." />
              }
            </div>
          )}

          {/* ══ MENSUAL ══ */}
          {tab==='mensual' && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'var(--muted)', textTransform:'uppercase' }}>
                {MONTHS_ES[now.getMonth()]} {now.getFullYear()}
              </div>

              {mWeeks.length > 0 ? (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:4 }}>Consistencia semanal</div>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:14 }}>% calculado sobre días reales — la semana actual solo incluye hasta hoy</div>
                  <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
                    {mWeeks.map((w,i) => (
                      <VBar key={i} pct={w.pct} dayLabel={w.label} dateNum={i+1} color={AREA_CFG[0].color} delay={i*120} isToday={false} />
                    ))}
                  </div>
                </div>
              ) : <EmptyState msg="Aún no hay datos de hábitos este mes. Ve al tracker y empieza hoy. 💪" />}

              {mWeeks.length > 0 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:4 }}>Progreso por área</div>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:10 }}>Promedio de {mWeeks.length} semana{mWeeks.length>1?'s':''} con datos</div>
                  {AREA_CFG.map((a,i) => <HBar key={a.id} label={a.label} value={mScores[a.id]??0} color={a.color} delay={i*80} />)}
                </div>
              )}

              {Object.keys(mMoods).length > 0 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:12 }}>Cómo te sentiste este mes</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {Object.entries(mMoods).sort(([,a],[,b])=>b-a).map(([emo,count]) => {
                      const max = Math.max(...Object.values(mMoods))
                      const color = EMO_COLOR[emo] ?? 'var(--muted)'
                      return (
                        <div key={emo} style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:13, minWidth:130 }}>{emo}</span>
                          <div style={{ flex:1, height:8, background:'var(--cream2)', borderRadius:4, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${Math.round((count/max)*100)}%`, background:color, borderRadius:4, transition:'width 1s ease' }} />
                          </div>
                          <span style={{ fontSize:11, color:'var(--muted)', minWidth:28 }}>{count}d</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ ANUAL ══ */}
          {tab==='anual' && (
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'var(--muted)', textTransform:'uppercase' }}>
                {now.getFullYear()} · {aWeekCount} semana{aWeekCount!==1?'s':''} con datos
              </div>

              {aWeekCount < 2 ? (
                <div style={{ textAlign:'center', padding:'32px 20px', background:'var(--cream)', borderRadius:14, border:'0.8px solid var(--cream2)' }}>
                  <div style={{ fontSize:28, marginBottom:12 }}>🌱</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'var(--brown)', marginBottom:8 }}>
                    Estás construyendo tu historial
                  </div>
                  <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, maxWidth:320, margin:'0 auto' }}>
                    El reporte anual se genera a partir de <strong>2 semanas completas</strong> de datos.
                    Tienes {aWeekCount === 0 ? 'menos de una semana' : '1 semana'} registrada.
                    ¡Sigue así! 💪
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:4 }}>Progreso por área</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:20 }}>Promedio real de {aWeekCount} semanas registradas este año</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, justifyItems:'center' }}>
                      {AREA_CFG.map(a => (
                        <RadialRing key={a.id} value={aScores[a.id]??0} color={a.color} label={a.label.split(' ').slice(1).join(' ')} size={90} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <RadialRing
                      value={Math.round(Object.values(aScores).reduce((a,b)=>a+b,0)/6)}
                      color="var(--rose)" label="Promedio general" size={110}
                    />
                  </div>

                  <div style={{ padding:'16px', background:'var(--cream)', borderRadius:12, border:'0.8px solid var(--cream2)' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--brown)', marginBottom:12 }}>Tu perfil de bienestar ({aWeekCount} semanas)</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {AREA_CFG.map((a,i) => (
                        <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:16 }}>{a.label.split(' ')[0]}</span>
                          <div style={{ flex:1, height:10, background:'var(--cream2)', borderRadius:5, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${aScores[a.id]??0}%`, background:a.color, borderRadius:5, transition:`width 1.2s cubic-bezier(.4,0,.2,1) ${i*100}ms` }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:a.color, minWidth:36 }}>{aScores[a.id]??0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
