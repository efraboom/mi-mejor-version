'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const AREAS = ['esp', 'fis', 'men', 'emo', 'pro', 'fin'] as const
type AreaId = typeof AREAS[number]
type Scores = Record<AreaId, number>

const DEFAULT: Scores = { esp: 0, fis: 0, men: 0, emo: 0, pro: 0, fin: 0 }

export function useProgress(userId: string) {
  const [scores, setScores] = useState<Scores>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('progress_scores')
      .select('area_id, valor')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) {
          const s = { ...DEFAULT }
          data.forEach(r => { if (r.area_id in s) s[r.area_id as AreaId] = r.valor })
          setScores(s)
        }
        setLoading(false)
      })
  }, [userId])

  return { scores, loading }
}
