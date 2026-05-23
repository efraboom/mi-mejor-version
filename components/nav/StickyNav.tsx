'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',   label: '🏠 Inicio' },
  { href: '/diagnostico', label: '🎯 Diagnóstico' },
  { href: '/areas',       label: '🌸 Mis Áreas' },
  { href: '/habitos',     label: '⭐ Hábitos' },
  { href: '/rutina',      label: '☀️ Rutina' },
  { href: '/tracker',     label: '✅ Tracker' },
  { href: '/semanal',     label: '📅 Semanal' },
  { href: '/emocional',   label: '🤍 Bienestar' },
  { href: '/espiritual',  label: '✝️ Espiritual' },
  { href: '/progreso',    label: '📈 Progreso' },
]

export default function StickyNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky-nav">
      <div className="nav-inner">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-btn${pathname === href ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="nav-btn"
          style={{ marginLeft: 'auto', color: 'var(--rose)' }}
        >
          Salir
        </button>
      </div>
    </nav>
  )
}
