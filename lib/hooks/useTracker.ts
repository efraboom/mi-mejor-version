'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function getWeekStart(offset = 0): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + offset * 7)
  return d.toISOString().split('T')[0]
}

const AREA_HABITS: Record<string, number[]> = {
  esp: [0],
  fis: [1, 2],
  men: [3, 4],
  emo: [3, 6],
  pro: [4, 5],
  fin: [5],
}

function calcAreaProgress(state: Record<string, boolean>, habitIndices: number[]): number {
  const total = habitIndices.length * 7
  if (total === 0) return 0
  const done = habitIndices.reduce((acc, hi) => {
    for (let di = 0; di < 7; di++) { if (state[`${hi}-${di}`]) acc++ }
    return acc
  }, 0)
  return Math.round((done / total) * 100)
}

export function isFutureDay(weekStart: string, dayIndex: number): boolean {
  const day = new Date(weekStart + 'T12:00:00')
  day.setDate(day.getDate() + dayIndex)
  day.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return day > today
}

type TrackerState = Record<string, boolean>

export function useTracker(userId: string) {
  const currentWeekStart                  = getWeekStart()
  const [activeWeekStart, setActiveWeek]  = useState(currentWeekStart)
  const [state, setState]                 = useState<TrackerState>({})
  const [loading, setLoading]             = useState(true)
  const supabase                          = createClient()
  const saveTimer                         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTimer                     = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    const week = activeWeekStart
    async function load() {
      try {
        const { data } = await supabase
          .from('tracker_entries')
          .select('habit_index, day_index, completed')
          .eq('user_id', userId)
          .eq('week_start', week)
        if (data) {
          const s: TrackerState = {}
          data.forEach(r => { s[`${r.habit_index}-${r.day_index}`] = r.completed })
          setState(s)
        } else {
          setState({})
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId, activeWeekStart])

  const saveProgress = useCallback((nextState: TrackerState) => {
    if (progressTimer.current) clearTimeout(progressTimer.current)
    progressTimer.current = setTimeout(async () => {
      const upserts = Object.entries(AREA_HABITS).map(([area_id, indices]) => ({
        user_id: userId,
        area_id,
        valor: calcAreaProgress(nextState, indices),
        updated_at: new Date().toISOString(),
      }))
      await supabase.from('progress_scores').upsert(upserts, { onConflict: 'user_id,area_id' })
    }, 1000)
  }, [userId])

  const toggle = useCallback((habitIndex: number, dayIndex: number) => {
    if (isFutureDay(activeWeekStart, dayIndex)) return
    const key = `${habitIndex}-${dayIndex}`
    setState(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        await supabase.from('tracker_entries').upsert(
          {
            user_id: userId,
            habit_index: habitIndex,
            day_index: dayIndex,
            week_start: activeWeekStart,
            completed: next[key],
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,habit_index,day_index,week_start' }
        )
      }, 800)
      saveProgress(next)
      return next
    })
  }, [userId, activeWeekStart, saveProgress])

  const goNextWeek = useCallback(() => {
    setActiveWeek(prev => {
      const d = new Date(prev + 'T12:00:00')
      d.setDate(d.getDate() + 7)
      return d.toISOString().split('T')[0]
    })
  }, [])

  const goPrevWeek = useCallback(() => {
    setActiveWeek(prev => {
      const d = new Date(prev + 'T12:00:00')
      d.setDate(d.getDate() - 7)
      return d.toISOString().split('T')[0]
    })
  }, [])

  const goCurrentWeek = useCallback(() => {
    setActiveWeek(currentWeekStart)
  }, [currentWeekStart])

  return { state, loading, toggle, weekStart: activeWeekStart, currentWeekStart, goNextWeek, goPrevWeek, goCurrentWeek }
}
