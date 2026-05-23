'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Key = string  // "semana-habitoIndex"

export function useMetaProgreso(userId: string, metaId: string | null) {
  const [completed, setCompleted] = useState<Set<Key>>(new Set())
  const [fechas, setFechas]       = useState<Record<Key, string>>({})
  const [loading, setLoading]     = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!metaId) { setLoading(false); return }
    setLoading(true)
    const id = metaId
    async function load() {
      const { data } = await supabase
        .from('meta_progreso')
        .select('semana, habito_index, fecha_completado')
        .eq('meta_id', id)
      if (data) {
        const c = new Set<Key>()
        const f: Record<Key, string> = {}
        data.forEach(r => {
          const k = `${r.semana}-${r.habito_index}`
          c.add(k)
          f[k] = r.fecha_completado
        })
        setCompleted(c)
        setFechas(f)
      }
      setLoading(false)
    }
    load()
  }, [metaId])

  const toggle = useCallback(async (semana: number, habitoIndex: number) => {
    if (!metaId) return
    const key = `${semana}-${habitoIndex}`
    const wasDone = completed.has(key)

    // Optimistic update
    setCompleted(prev => {
      const next = new Set(prev)
      wasDone ? next.delete(key) : next.add(key)
      return next
    })

    if (wasDone) {
      setFechas(prev => { const n = { ...prev }; delete n[key]; return n })
      await supabase
        .from('meta_progreso')
        .delete()
        .eq('meta_id', metaId)
        .eq('semana', semana)
        .eq('habito_index', habitoIndex)
    } else {
      const fecha = new Date().toISOString().split('T')[0]
      setFechas(prev => ({ ...prev, [key]: fecha }))
      await supabase.from('meta_progreso').upsert(
        { user_id: userId, meta_id: metaId, semana, habito_index: habitoIndex, fecha_completado: fecha },
        { onConflict: 'meta_id,semana,habito_index' }
      )
    }
  }, [metaId, userId, completed])

  return { completed, fechas, loading, toggle }
}
