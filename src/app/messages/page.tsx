export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserAvatar } from '@/components/UserAvatar'
import type { User, Message } from '@/lib/types'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(*), recipient:users!recipient_id(*)')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const conversationMap = new Map<string, { user: User; lastMessage: Message; unreadCount: number }>()
  for (const msg of messages || []) {
    const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
    const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, { user: otherUser, lastMessage: msg, unreadCount: 0 })
    }
    if (msg.recipient_id === user.id && !msg.read) {
      conversationMap.get(otherId)!.unreadCount++
    }
  }

  const conversations = Array.from(conversationMap.values())

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">Messages</h1>
      </header>
      {conversations.length === 0 ? (
        <p className="py-20 text-center text-blade-steel">No messages yet</p>
      ) : (
        conversations.map(conv => (
          <Link key={conv.user.id} href={`/messages/${conv.user.id}`}
            className="flex items-center gap-3 border-b border-blade-border px-4 py-3 hover:bg-blade-surface">
            <UserAvatar src={conv.user.avatar_url} username={conv.user.username} size={48} />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-white">{conv.user.username}</p>
              <p className="truncate text-sm text-blade-steel">{conv.lastMessage.body}</p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blade-red text-xs font-bold text-white">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        ))
      )}
    </main>
  )
}
