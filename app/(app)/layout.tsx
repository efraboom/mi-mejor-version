import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StickyNav from '@/components/nav/StickyNav'
import NotificationPrompt from '@/components/NotificationPrompt'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <>
      <StickyNav />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </main>
      <NotificationPrompt />
    </>
  )
}
