'use client'
import { useState, useEffect } from 'react'
import { useNotifications } from '@/lib/hooks/useNotifications'

export default function NotificationPrompt() {
  const [show, setShow]         = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { requestPermission }   = useNotifications()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const already = localStorage.getItem('notif_asked')
    if (already) return
    const t = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(t)
  }, [])

  async function accept() {
    await requestPermission()
    localStorage.setItem('notif_asked', '1')
    setShow(false)
  }

  function dismiss() {
    localStorage.setItem('notif_asked', '1')
    setDismissed(true)
    setShow(false)
  }

  if (!show || dismissed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: 'var(--white)', border: '0.8px solid rgba(201,169,110,.3)',
      borderRadius: 16, padding: '20px 24px', maxWidth: 320,
      boxShadow: '0 8px 32px rgba(92,64,51,.12)',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>🌸</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: 'var(--brown)', marginBottom: 6 }}>
        Recordatorios de hábitos
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
        Activa las notificaciones para recibir tu recordatorio diario <strong style={{ color: 'var(--rose)' }}>"No olvides tu checklist de hoy 🌸"</strong>
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="save-btn" style={{ margin: 0, flex: 1 }} onClick={accept}>
          Activar ♡
        </button>
        <button
          onClick={dismiss}
          style={{ padding: '10px 16px', borderRadius: 24, border: '0.8px solid var(--cream2)', background: 'transparent', fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}
