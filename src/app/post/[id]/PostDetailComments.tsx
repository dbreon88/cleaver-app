'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import { CommentForm } from '@/components/CommentForm'

export function PostDetailComments({ postId }: { postId: string }) {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(body: string) {
    if (!user) return
    await supabase.from('comments').insert({ user_id: user.id, post_id: postId, body })
    router.refresh()
  }

  return <CommentForm onSubmit={handleSubmit} />
}
