'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'

export function MessageThread({ recipientId }: { recipientId: string }) {
  const [body, setBody] = useState('')
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || !user) return
    await supabase.from('messages').insert({ sender_id: user.id, recipient_id: recipientId, body: body.trim() })
    setBody('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2 border-t border-blade-border px-4 py-3">
      <input type="text" placeholder="Message..." value={body}
        onChange={(e) => setBody(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-blade-steel focus:outline-none" />
      <button type="submit" disabled={!body.trim()} className="font-semibold text-blade-red disabled:opacity-30">Send</button>
    </form>
  )
}
