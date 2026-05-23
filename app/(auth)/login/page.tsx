'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router  = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--white)', border: '0.8px solid rgba(201,169,110,.25)',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(92,64,51,.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✦ 🪷 ✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--brown)', marginBottom: '4px' }}>
            Bienvenida de vuelta
          </h1>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '18px', color: 'var(--blush2)' }}>
            tu mejor versión te espera ♡
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
              Correo electrónico
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="tu@correo.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(181,112,106,.1)', border: '0.8px solid rgba(181,112,106,.3)', borderRadius: '8px', fontSize: '13px', color: 'var(--rose)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="save-btn" style={{ marginTop: '4px', textAlign: 'center', width: '100%' }}>
            {loading ? 'Entrando...' : 'Entrar ♡'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '0.8px', background: 'var(--cream2)' }} />
          <span style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px' }}>O</span>
          <div style={{ flex: 1, height: '0.8px', background: 'var(--cream2)' }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{ width: '100%', padding: '12px 24px', borderRadius: '24px', border: '0.8px solid var(--cream2)', background: 'var(--white)', fontSize: '13px', fontWeight: 700, color: 'var(--brown)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continuar con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--muted)' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" style={{ color: 'var(--rose)', fontWeight: 700 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
