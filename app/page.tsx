import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>
}) {
  const params = await searchParams

  // Si llega un code OAuth aquí, reenviarlo al callback
  if (params.code) {
    const next = params.next ? `&next=${params.next}` : ''
    redirect(`/auth/callback?code=${params.code}${next}`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  redirect(user ? '/dashboard' : '/login')
}
