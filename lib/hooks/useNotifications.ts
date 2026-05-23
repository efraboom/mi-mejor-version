'use client'
import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    OneSignal?: {
      init: (config: object) => Promise<void>
      User: { PushSubscription: { optIn: () => Promise<void> } }
      Notifications: { requestPermission: () => Promise<void>; permission: boolean }
    }
  }
}

export function useNotifications() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    if (!appId || typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    script.onload = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!window.OneSignal) (window as any).OneSignal = []
      await window.OneSignal?.init?.({
        appId,
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
      })
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      await window.OneSignal?.Notifications.requestPermission()
    } catch {}
  }, [])

  const scheduleHabitReminder = useCallback(() => {
    /* Se gestiona desde el dashboard de OneSignal (scheduled notifications) */
  }, [])

  const scheduleJournalReminder = useCallback(() => {
    /* Se gestiona desde el dashboard de OneSignal */
  }, [])

  return { requestPermission, scheduleHabitReminder, scheduleJournalReminder }
}
