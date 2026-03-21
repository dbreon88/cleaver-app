export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { PostCard } from '@/components/PostCard'
import { CommentList } from '@/components/CommentList'
import { PostDetailComments } from './PostDetailComments'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('posts')
    .select('*, author:users!author_id(*), likes(count), comments(count)')
    .eq('id', params.id)
    .single()

  if (!post) return notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*, user:users!user_id(*)')
    .eq('post_id', params.id)
    .order('created_at', { ascending: true })

  let liked = false
  let saved = false
  if (user) {
    const [likeRes, saveRes] = await Promise.all([
      supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', params.id).single(),
      supabase.from('saves').select('id').eq('user_id', user.id).eq('post_id', params.id).single(),
    ])
    liked = !!likeRes.data
    saved = !!saveRes.data
  }

  const enrichedPost = {
    ...post,
    like_count: post.likes?.[0]?.count ?? 0,
    comment_count: post.comments?.[0]?.count ?? 0,
    liked_by_user: liked,
    saved_by_user: saved,
  }

  return (
    <main>
      <header className="sticky top-0 z-40 flex items-center border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">Post</h1>
      </header>
      <PostCard post={enrichedPost} />
      <CommentList comments={comments || []} />
      <PostDetailComments postId={params.id} />
    </main>
  )
}
