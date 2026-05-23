import { createClient } from '@/lib/supabase/server'
import HabitTracker from '@/components/tracker/HabitTracker'
import PlanEtapaCard from '@/components/tracker/PlanEtapaCard'

type Paso = { semana: number; titulo: string; descripcion: string; habitos_clave: string[] }

export default async function TrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: meta } = await supabase
    .from('metas')
    .select('titulo, plazo, pasos, created_at')
    .eq('user_id', user!.id)
    .eq('activa', true)
    .maybeSingle()

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 5</div>
        <h2>Tracker de <span className="script">hábitos</span></h2>
        <div className="sec-divider" />
        <p>Marca cada hábito completado. Ver tu progreso es la mejor motivación.</p>
      </div>

      {meta && (
        <PlanEtapaCard
          titulo={meta.titulo as string}
          plazo={meta.plazo as string}
          pasos={(meta.pasos as Paso[]) ?? []}
          createdAt={meta.created_at as string}
        />
      )}

      <HabitTracker userId={user!.id} />
    </div>
  )
}
