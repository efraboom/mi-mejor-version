'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type CheckState = Record<number, boolean>

function today() { return new Date().toISOString().split('T')[0] }

export function useChecklist(userId: string) {
  const [state, setState] = useState<CheckState>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const fecha = today()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('checklist_daily')
        .select('item_index, completed')
        .eq('user_id', userId)
        .eq('fecha', fecha)
      if (data) {
        const s: CheckState = {}
        data.forEach(r => { s[r.item_index] = r.completed })
        setState(s)
      }
      setLoading(false)
    }
    load()
  }, [userId, fecha])

  const toggle = useCallback(async (itemIndex: number) => {
    const next = !state[itemIndex]
    setState(prev => ({ ...prev, [itemIndex]: next }))
    await supabase.from('checklist_daily').upsert(
      { user_id: userId, fecha, item_index: itemIndex, completed: next },
      { onConflict: 'user_id,fecha,item_index' }
    )
  }, [userId, fecha, state])

  return { state, loading, toggle }
}
