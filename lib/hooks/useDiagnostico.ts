'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Responses = Record<string, string>
type SavedStatus = Record<string, boolean>

export function useDiagnostico(userId: string) {
  const [responses, setResponses] = useState<Responses>({})
  const [saved, setSaved]         = useState<SavedStatus>({})
  const [loading, setLoading]     = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    supabase
      .from('diagnostico_responses')
      .select('pregunta_key, respuesta')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) {
          const r: Responses = {}
          data.forEach(d => { r[d.pregunta_key] = d.respuesta ?? '' })
          setResponses(r)
        }
        setLoading(false)
      })
  }, [userId])

  const get = useCallback((key: string) => responses[key] ?? '', [responses])

  const set = useCallback((key: string, value: string) => {
    setResponses(prev => ({ ...prev, [key]: value }))
    setSaved(prev => ({ ...prev, [key]: false }))
  }, [])

  // Guarda todas las preguntas de una card (array de keys)
  const saveCard = useCallback(async (keys: string[]) => {
    const now = new Date().toISOString()
    const rows = keys.map(key => ({
      user_id: userId,
      pregunta_key: key,
      respuesta: responses[key] ?? '',
      updated_at: now,
    }))
    const { error } = await supabase
      .from('diagnostico_responses')
      .upsert(rows, { onConflict: 'user_id,pregunta_key' })
    if (!error) {
      setSaved(prev => {
        const next = { ...prev }
        keys.forEach(k => { next[k] = true })
        return next
      })
      // Borra el ✓ tras 3 segundos
      setTimeout(() => {
        setSaved(prev => {
          const next = { ...prev }
          keys.forEach(k => { next[k] = false })
          return next
        })
      }, 3000)
    }
  }, [userId, responses])

  const isSaved = useCallback((keys: string[]) => keys.every(k => saved[k]), [saved])

  return { get, set, saveCard, isSaved, loading }
}
