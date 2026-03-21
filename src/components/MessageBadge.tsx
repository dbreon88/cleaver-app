'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'

export function MessageBadge() {
  const [count, setCount] = useState(0)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    supabase.from('messages').select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id).eq('read', false)
      .then(({ count }) => setCount(count || 0))
  }, [user])

  if (count === 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blade-red text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
