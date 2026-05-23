import { createClient } from '@/lib/supabase/server'
import DiagnosticoForm from '@/components/DiagnosticoForm'
import MetaForm from '@/components/diagnostico/MetaForm'

type Paso = { semana: number; titulo: string; descripcion: string; habitos_clave: string[] }

export default async function DiagnosticoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id

  const [{ data: diagData }, { data: metaData }] = await Promise.all([
    supabase
      .from('diagnostico_responses')
      .select('pregunta_key, respuesta')
      .eq('user_id', userId),
    supabase
      .from('metas')
      .select('id, titulo, plazo, pasos')
      .eq('user_id', userId)
      .eq('activa', true)
      .maybeSingle(),
  ])

  const diagnostico: Record<string, string> = {}
  diagData?.forEach(r => { if (r.pregunta_key) diagnostico[r.pregunta_key] = r.respuesta ?? '' })

  const metaActiva = metaData
    ? {
        id: metaData.id as string,
        titulo: metaData.titulo as string,
        plazo: metaData.plazo as string,
        pasos: (metaData.pasos as Paso[]) ?? [],
      }
    : null

  return (
    <div>
      <div className="sec-head">
        <div className="sec-tag">Paso 1</div>
        <h2>Diagnóstico <span className="script">inicial</span></h2>
        <div className="sec-divider" />
        <p>Antes de cambiar, necesitas verte con honestidad y amor. Responde estas preguntas desde tu corazón.</p>
      </div>
      <DiagnosticoForm userId={userId} />
      <MetaForm userId={userId} diagnostico={diagnostico} metaActiva={metaActiva} />
    </div>
  )
}
