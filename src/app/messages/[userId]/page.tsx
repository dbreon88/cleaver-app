export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { UserAvatar } from '@/components/UserAvatar'
import { MessageThread } from './MessageThread'

export default async function ConversationPage({ params }: { params: { userId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: otherUser } = await supabase.from('users').select('*').eq('id', params.userId).single()
  if (!otherUser) return notFound()

  const { data: messages } = await supabase.from('messages').select('*')
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${params.userId}),and(sender_id.eq.${params.userId},recipient_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  await supabase.from('messages').update({ read: true })
    .eq('sender_id', params.userId).eq('recipient_id', user.id).eq('read', false)

  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-blade-border bg-blade-bg px-4 py-3">
        <UserAvatar src={otherUser.avatar_url} username={otherUser.username} size={32} />
        <h1 className="text-lg font-bold text-white">{otherUser.username}</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {(messages || []).map(msg => (
          <div key={msg.id}
            className={`mb-2 max-w-[75%] rounded-2xl px-4 py-2 ${
              msg.sender_id === user.id ? 'ml-auto bg-blade-red text-white' : 'bg-blade-surface text-blade-silver'
            }`}>
            <p className="text-sm">{msg.body}</p>
          </div>
        ))}
      </div>
      <MessageThread recipientId={params.userId} />
    </main>
  )
}
