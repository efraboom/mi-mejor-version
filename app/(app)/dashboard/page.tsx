import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('users_profile')
    .select('nombre')
    .eq('user_id', user!.id)
    .maybeSingle()

  const nombre =
    (profile as { nombre?: string | null } | null)?.nombre ||
    (user?.user_metadata?.nombre as string | undefined) ||
    'hermosa'

  return (
    <div>
      {/* COVER */}
      <div style={{
        minHeight: '80vh', background: 'var(--cream)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        border: '0.8px solid var(--cream2)', borderRadius: '16px', marginBottom: '32px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '16px',
          background: `
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(143,166,140,.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 20%, rgba(201,169,110,.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(212,168,160,.10) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', inset: '20px', border: '0.8px solid rgba(201,169,110,.4)', pointerEvents: 'none', borderRadius: '2px' }} />

        <div style={{ fontSize: '32px', color: 'var(--gold)', marginBottom: '8px', letterSpacing: '8px', opacity: .8 }}>✦ 🪷 ✦</div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', fontWeight: 300 }}>
          Guía Completa
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(52px,9vw,88px)', fontWeight: 600, lineHeight: 1, color: 'var(--brown)', letterSpacing: '-1px', marginBottom: 0 }}>
          MI MEJOR
        </h1>
        <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(44px,7vw,72px)', color: 'var(--blush2)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
          versión ♡
        </span>

        <div style={{ color: 'var(--blush)', fontSize: '14px', margin: '16px 0', letterSpacing: '6px', opacity: .7 }}>♡ ✦ ♡</div>

        <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '400px', lineHeight: 1.8, marginBottom: '12px', fontWeight: 300 }}>
          Hola, <strong style={{ color: 'var(--rose)', fontWeight: 700 }}>{nombre}</strong>. ¿Lista para comenzar?
        </p>
        <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '400px', lineHeight: 1.8, marginBottom: '28px', fontWeight: 300 }}>
          Un sistema práctico y sostenible para transformar tu vida en equilibrio:<br />
          <strong style={{ color: 'var(--rose)', fontWeight: 700 }}>espiritual • física • mental • emocional • económica</strong>
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { emoji: '✝️', label: 'Espiritual', bg: 'rgba(212,168,160,.15)' },
            { emoji: '💪', label: 'Física',     bg: 'rgba(143,166,140,.15)' },
            { emoji: '🧠', label: 'Mental',     bg: 'rgba(212,168,160,.12)' },
            { emoji: '🤍', label: 'Emocional',  bg: 'rgba(212,168,160,.12)' },
            { emoji: '💼', label: 'Profesional',bg: 'rgba(201,169,110,.12)' },
          ].map(({ emoji, label, bg }) => (
            <div key={label} style={{
              width: 72, height: 72, borderRadius: '50%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, gap: 2, border: '0.8px solid rgba(201,169,110,.3)', background: bg,
            }}>
              {emoji}
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '22px', color: 'var(--muted)', marginBottom: '4px', fontWeight: 500 }}>
          Pequeños hábitos, grandes cambios,
        </div>
        <div style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '36px' }}>
          ✦ una vida con propósito ✦
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'var(--sage)', borderRadius: '4px', overflow: 'hidden', width: '100%', maxWidth: '520px' }}>
          {[
            { href: '/diagnostico', icon: '🎯', label: 'PROPÓSITO' },
            { href: '/habitos',     icon: '✅', label: 'ACCIÓN' },
            { href: '/progreso',    icon: '📈', label: 'CRECIMIENTO' },
            { href: '/emocional',   icon: '🤍', label: 'BIENESTAR' },
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href} style={{
              flex: 1, padding: '14px 8px', textAlign: 'center',
              borderRight: '0.8px solid rgba(255,255,255,.15)',
              fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              transition: 'background .2s',
            }}>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '24px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--muted)', opacity: .6 }}>
          Tu vida <span style={{ margin: '0 8px', color: 'var(--gold)' }}>•</span> Tu historia <span style={{ margin: '0 8px', color: 'var(--gold)' }}>•</span> Tu transformación
        </div>
      </div>
    </div>
  )
}
