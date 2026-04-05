'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function PresencePing() {
  useEffect(() => {
    const supabase = createClient()
    const ping = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('user_id', user.id)
    }
    ping()
    const interval = setInterval(ping, 4 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  return null
}
