'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function useJournal(userId: string) {
  const [texto, setTexto]         = useState('')
  const [emocion, setEmocion]     = useState('')
  const [promptUsado, setPrompt]  = useState('')
  const [saving, setSaving]       = useState(false)
  const saveTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase                  = createClient()
  const fecha                     = today()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('journal_entries')
        .select('texto, emocion, prompt_usado')
        .eq('user_id', userId)
        .eq('fecha', fecha)
        .maybeSingle()
      if (data) {
        setTexto(data.texto ?? '')
        setEmocion(data.emocion ?? '')
        setPrompt(data.prompt_usado ?? '')
      }
    }
    load()
  }, [userId, fecha])

  const save = useCallback(async (fields: { texto?: string; emocion?: string; prompt_usado?: string }) => {
    setSaving(true)
    await supabase.from('journal_entries').upsert(
      { user_id: userId, fecha, updated_at: new Date().toISOString(), ...fields },
      { onConflict: 'user_id,fecha' }
    )
    setSaving(false)
  }, [userId, fecha])

  function changeTexto(val: string) {
    setTexto(val)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save({ texto: val, emocion, prompt_usado: promptUsado }), 800)
  }

  function changeEmocion(val: string) {
    setEmocion(val)
    save({ texto, emocion: val, prompt_usado: promptUsado })
  }

  function changePrompt(val: string) {
    setPrompt(val)
  }

  return { texto, emocion, promptUsado, saving, changeTexto, changeEmocion, changePrompt }
}
