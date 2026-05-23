'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [nombre, setNombre]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🪷</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--brown)', marginBottom: '12px' }}>
            ¡Bienvenida, {nombre}!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>
            Revisa tu correo para confirmar tu cuenta y comenzar tu transformación.
          </p>
          <Link href="/login" className="save-btn" style={{ display: 'inline-block', marginTop: '24px' }}>
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--white)', border: '0.8px solid rgba(201,169,110,.25)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(92,64,51,.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✦ 🪷 ✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--brown)', marginBottom: '4px' }}>
            Empieza tu transformación
          </h1>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '18px', color: 'var(--blush2)' }}>
            pequeños hábitos, grandes cambios ♡
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Tu nombre', value: nombre, setter: setNombre, type: 'text', placeholder: '¿Cómo te llamamos?' },
            { label: 'Correo electrónico', value: email, setter: setEmail, type: 'email', placeholder: 'tu@correo.com' },
            { label: 'Contraseña', value: password, setter: setPassword, type: 'password', placeholder: 'Mínimo 6 caracteres' },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>{label}</label>
              <input
                type={type} value={value} onChange={e => setter(e.target.value)} required
                placeholder={placeholder}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}
              />
            </div>
          ))}

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(181,112,106,.1)', border: '0.8px solid rgba(181,112,106,.3)', borderRadius: '8px', fontSize: '13px', color: 'var(--rose)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="save-btn" style={{ marginTop: '4px', textAlign: 'center', width: '100%' }}>
            {loading ? 'Creando tu perfil...' : 'Comenzar mi mejor versión ♡'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--rose)', fontWeight: 700 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
